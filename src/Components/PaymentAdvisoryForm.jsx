import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, runTransaction, get } from 'firebase/database';
import { db, rtdb } from '../Firebase/firebase';
import {
  Button,
  TextField,
  MenuItem,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Typography,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import InputAdornment from '@mui/material/InputAdornment';
import SaveIcon from '@mui/icons-material/Save';
import { Controller } from 'react-hook-form';

const PaymentAdvisoryForm = () => {
  const { control, register, handleSubmit, setValue, watch ,reset} = useForm({
    defaultValues: {
      vendorGSTIN: '',
      invoiceNumber: '',
      invoiceDate: '',
      invoiceReceiveDate: '',
      creditTerm: 0,
      dueDate: '',
      invoiceValue: 0,
      rows: [{
        bookingId: '',
        item: '',
        itemCode: '',
        debitAmount: 0,
        taxableValue: 0,
        gstRate: 0, // Valid initial value
        cgst: 0,
        sgst: 0,
        igst:0,
        hsnCode: ''
      }]
    }
  });

  const [nextAdvisoryId, setNextAdvisoryId] = useState('');
  const [bookingTotalsMap, setBookingTotalsMap] = useState({});
  const selectedVendorGSTIN = useWatch({ control, name: 'vendorGSTIN' });
  const { fields, append, remove } = useFieldArray({ control, name: 'rows' });
  const [vendors, setVendors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [itemsMap, setItemsMap] = useState({});

  // Available GST rates
  const gstRates = [0, 5, 12, 18, 28];

  //Calculate Debit amount based on CGST , SGST and IGST.
//   useEffect(() => {
//   const subscription = watch((values, { name }) => {
//     const rows = values.rows || [];

//     rows.forEach((row, index) => {
//       const taxableValue = parseFloat(row.taxableValue) || 0;
//       const cgst = parseFloat(row.cgst) || 0;
//       const sgst = parseFloat(row.sgst) || 0;
//       const igst = parseFloat(row.igst) || 0;

//       const debitAmount = taxableValue +
//         (taxableValue * cgst / 100) +
//         (taxableValue * sgst / 100) +
//         (taxableValue * igst / 100);

//       setValue(`rows.${index}.debitAmount`, parseFloat(debitAmount.toFixed(2)));
//     });
//   });

//   return () => subscription.unsubscribe();
// }, [watch, setValue]);


  // Fetch next advisory ID
  useEffect(() => {
    const fetchNextAdvisoryId = async () => {
      const sequenceRef = ref(rtdb, 'invoiceBooking');
      //console.log(sequenceRef)
      const snapshot = await get(sequenceRef);
      const currentSeq = snapshot.val() || 0;
      const nextSeq = currentSeq + 1;
      setNextAdvisoryId(`IB-${nextSeq.toString().padStart(3, '0')}`);
    };
    fetchNextAdvisoryId();
  }, []);

  // Vendor terms effect
  useEffect(() => {
    const applyTerms = async () => {
      if (!selectedVendorGSTIN) {
        setValue('creditTerm', 0);
        setValue('invoiceReceiveDate', '');
        return;
      }
      try {
        const vendorRef = doc(db, 'masters', 'ONBOARDING', 'VENDOR', selectedVendorGSTIN);
        const snap = await getDoc(vendorRef);
        if (snap.exists()) {
          const credit = snap.data().paymentTerms ?? 0;
          setValue('creditTerm', credit);
          const today = new Date().toISOString().substring(0, 10);
          setValue('invoiceReceiveDate', today);
        }
      } catch (e) {
        console.error('Error fetching vendor terms', e);
      }
    };
    applyTerms();
  }, [selectedVendorGSTIN, setValue]);

  // Fetch vendors and bookings
  useEffect(() => {
    const fetchVendors = async () => {
      const snapshot = await getDocs(collection(db, 'masters/ONBOARDING/VENDOR'));
      const list = snapshot.docs.map(doc => doc.data());
      console.log(list)
      setVendors(list);
    };

    const fetchAllBookings = async () => {
      const snapshot = await getDocs(collection(db, 'bookings'));
      const list = snapshot.docs.map(doc => doc.id);
      setBookings(list);
    };

    fetchVendors();
    fetchAllBookings();
  }, []);

  // Due date calculation
  const receiveDate = watch('invoiceReceiveDate');
  const creditTerm = watch('creditTerm');
  useEffect(() => {
    if (receiveDate && creditTerm >= 0) {
      const due = new Date(receiveDate);
      due.setDate(due.getDate() + parseInt(creditTerm, 10));
      setValue('dueDate', due.toISOString().substring(0, 10));
    }
  }, [receiveDate, creditTerm, setValue]);

  // GST calculation function
  const calculateGST = (index, taxableValue, gstRate) => {
    const taxable = parseFloat(taxableValue) || 0;
    const rate = gstRates.includes(parseFloat(gstRate)) ? parseFloat(gstRate) : 0;

    console.log(`Calculating for row ${index}:`, { taxableValue: taxable, gstRate: rate });

    if (taxable > 0 && rate > 0) {
      const gstFactor = rate / 100;
      const cgst = taxable * (gstFactor / 2);
      const sgst = taxable * (gstFactor / 2);
      const igst = 0;
      const debitAmount = taxable + cgst + sgst +igst;
      

      setValue(`rows.${index}.cgst`, parseFloat(cgst.toFixed(2)), { shouldDirty: false });
      setValue(`rows.${index}.sgst`, parseFloat(sgst.toFixed(2)), { shouldDirty: false });
      setValue(`rows.${index}.igst`, parseFloat(igst.toFixed(2)), { shouldDirty: false });
      setValue(`rows.${index}.debitAmount`, parseFloat(debitAmount.toFixed(2)), { shouldDirty: false });
    } else {
      setValue(`rows.${index}.cgst`, 0, { shouldDirty: false });
      setValue(`rows.${index}.sgst`, 0, { shouldDirty: false });
      setValue(`rows.${index}.igst`, 0, { shouldDirty: false });
      setValue(`rows.${index}.debitAmount`, 0, { shouldDirty: false });
    }
  };

  // Fetch items for booking
  const fetchItemsForBooking = async (bookingId) => {
    const invoiceDoc = await getDoc(doc(db, 'bookings', bookingId));
    if (invoiceDoc.exists()) {
      const data = invoiceDoc.data();
      const items = (data.items || []).map(item => ({
        itemId: item.itemId,
        codes: (item.rows || []).map(row => row.code)
      }));
      setItemsMap(prev => ({ ...prev, [bookingId]: items }));
      setBookingTotalsMap(prev => ({
        ...prev,
        [bookingId]: {
          pkgPrice: data.pkgPrice ?? 0,
          toPay: data.toPay ?? 0,
          availableAmount: data.availableAmount ?? data.toPay ?? 0
        }
      }));
    } else {
      console.warn(`Invoice not found for bookingId ${bookingId}`);
    }
  };

  const handleBookingChange = (index, bookingId) => {
    setValue(`rows.${index}.bookingId`, bookingId);
    setValue(`rows.${index}.item`, '');
    setValue(`rows.${index}.itemCode`, '');
    fetchItemsForBooking(bookingId);
  };

  const handleItemChange = (index, itemId) => {
    setValue(`rows.${index}.item`, itemId);
    setValue(`rows.${index}.itemCode`, '');
  };

  const onSubmit = async (data) => {
    const totalDebit = data.rows.reduce(
      (sum, row) => sum + (parseFloat(row.debitAmount) || 0),
      0
    );
    const invoiceVal = parseFloat(data.invoiceValue || 0);

    if (totalDebit > invoiceVal) {
      alert('Total debit amount cannot exceed the invoice value.');
      return;
    }
    if (totalDebit < invoiceVal) {
      alert('Total debit amount is less than the invoice value. Please adjust.');
      return;
    }

    // Validate debit amount against available amount
    for (const [index, row] of data.rows.entries()) {
      const bookingId = row.bookingId;
      const debitAmount = parseFloat(row.debitAmount) || 0;
      const availableAmount = bookingTotalsMap[bookingId]?.availableAmount || 0;
      if (debitAmount > availableAmount) {
        alert(`Debit amount for booking ${bookingId} exceeds available amount (${availableAmount}).`);
        return;
      }
    }

    try {
      // Get new sequence number
      const sequenceRef = ref(rtdb, 'invoiceBooking');
      let newSeq;
      await runTransaction(sequenceRef, current => {
        newSeq = (current || 0) + 1;
        return newSeq;
      });
      const advisoryId = `IB-${newSeq.toString().padStart(3, '0')}`;

      // Save advisory document
      const cleanedRows = data.rows.map(row => ({
        bookingId: row.bookingId,
        item: row.item,
        itemCode: row.itemCode,
        taxableValue: row.taxableValue,
        gstRate: row.gstRate,
        cgst: row.cgst,
        sgst: row.sgst,
        debitAmount: row.debitAmount,
        hsnCode: row.hsnCode
      }));

      const docRef = doc(db, `invoiceBooking/${data.vendorGSTIN}/${advisoryId}/${data.invoiceNumber}`);
      await setDoc(docRef, {
        vendorGSTIN: data.vendorGSTIN,
        invoiceNumber: data.invoiceNumber,
        advisoryInvoiceNumber: `${advisoryId}/${data.invoiceNumber}`,
        invoiceDate: data.invoiceDate,
        invoiceReceiveDate: data.invoiceReceiveDate,
        creditTerm: data.creditTerm,
        dueDate: data.dueDate,
        invoiceValue: data.invoiceValue,
        rows: cleanedRows,
        createdAt: new Date()
      });

      // Save advisoryId to metadata
      const metadataRef = doc(db, `invoiceBooking/${data.vendorGSTIN}/metadata/bookingIds`);
      const metadataSnap = await getDoc(metadataRef);
      const existingIds = metadataSnap.exists() ? metadataSnap.data().ids || [] : [];
      if (!existingIds.includes(advisoryId)) {
        await setDoc(metadataRef, { ids: [...existingIds, advisoryId] }, { merge: true });
      }

      // Process booking updates
      const bookingUpdates = {};
      cleanedRows.forEach(row => {
        const bookingId = row.bookingId;
        const debitAmount = parseFloat(row.debitAmount) || 0;
        if (!bookingUpdates[bookingId]) {
          bookingUpdates[bookingId] = { invoiceBookingids: [], debitTotal: 0 };
        }
        bookingUpdates[bookingId].invoiceBookingids.push(advisoryId);
        bookingUpdates[bookingId].debitTotal += debitAmount;
      });

      // Update each booking
      for (const [bookingId, update] of Object.entries(bookingUpdates)) {
        const bookingRef = doc(db, 'bookings', bookingId);
        const bookingSnap = await getDoc(bookingRef);

        if (bookingSnap.exists()) {
          const bookingData = bookingSnap.data();
          const currentAdvisoryIds = bookingData.invoiceBookingids || [];
          const newAdvisoryIds = [...new Set([...currentAdvisoryIds, ...update.invoiceBookingids])];
          const currentAvailable = bookingData.availableAmount ?? bookingData.toPay ?? 0;
          const newAvailableAmount = Math.max(0, currentAvailable - update.debitTotal);

          await setDoc(bookingRef, {
            invoiceBookingids: newAdvisoryIds,
            availableAmount: newAvailableAmount
          }, { merge: true });
        }
      }

      alert(`Invoice Boooking Advisory ${advisoryId} saved!`);
      reset();
      setTimeout(() => {
        window.location.reload();
      }, 1000); 
    } catch (err) {
      console.error('Error saving advisory:', err);
      alert('Failed to save advisory');
    }
  };
  

  return (
    <Box p={3} sx={{ border: '1px solid gray', borderRadius: '10px', backgroundColor: 'white', maxWidth: '76vw' }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#005899', fontWeight: 'bold' }}>
        Vendor Invoice Booking
      </Typography>
      
      <Box mb={3}>
        <Typography variant="h6" sx={{ color: '#333' }}>Invoice Booking ID: {nextAdvisoryId}</Typography>
      </Box>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Vendor Selection */}
        <Controller
  name="vendorGSTIN"
  control={control}
  defaultValue=""
  rules={{ required: true }}
  render={({ field }) => (
    <TextField
      select
      label="Select Vendor"
      fullWidth
      {...field}
      sx={{ 
        backgroundColor: '#f8f9fa',
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: '#005899', borderWidth: '1px' },
          '&:hover fieldset': { borderColor: '#005899' },
          '&.Mui-focused fieldset': { borderColor: '#005899' },
        }
      }}
    >
      <MenuItem value="">
        <em>Select a vendor</em>
      </MenuItem>
      {vendors.map((vendor) => (
        <MenuItem key={vendor.id} value={vendor.id}>
          {vendor.contactName} ({vendor.id})
        </MenuItem>
      ))}
    </TextField>
  )}
/>
        
        {/* Basic Invoice Information */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#005899', mb: 2 }}>Invoice Details</Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, 
            gap: 3
          }}>
            <TextField 
              label="Invoice Number" 
              {...register('invoiceNumber', { required: true })} 
              fullWidth
              sx={{ backgroundColor: 'white' }}
            />
            <TextField
              label="Invoice Date"
              type="date"
              {...register('invoiceDate', { required: true })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ backgroundColor: 'white' }}
            />
            <TextField
              label="Invoice Booking Date"
              type="date"
              {...register('invoiceReceiveDate', { required: true })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ backgroundColor: 'white' }}
            />
            <TextField
              label="Credit Term (days)"
              type="number"
              {...register('creditTerm', { valueAsNumber: true })}
              fullWidth
              sx={{ backgroundColor: 'white' }}
            />
            <TextField
              label="Due Date"
              type="date"
              value={watch('dueDate') || ''}
              InputProps={{ readOnly: true }}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ backgroundColor: 'white' }}
            />
            <TextField
              label="Total Invoice Value"
              type="number"
              {...register('invoiceValue', { valueAsNumber: true })}
              fullWidth
              sx={{ backgroundColor: 'white' }}
            />
          </Box>
        </Paper>
        
        {/* Table Section */}
        <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
          <Typography variant="h6" sx={{ p: 2, backgroundColor: '#005899', color: 'white' }}>
            Invoice Line Items
          </Typography>
          
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ backgroundColor: '#e6f0f7' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 140 }}>Booking ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 140 }}>Item</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 140 }}>Item Code</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Available Package Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 130 }}>Taxable Value</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>GST Rate (%)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 130 }}>CGST</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 130 }}>SGST</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 130 }}>IGST</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 130 }}>Debit Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>HSN Code</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => {
                  const bookingId = watch(`rows.${index}.bookingId`) || '';
                  const itemId = watch(`rows.${index}.item`) || '';
                  const gstRate = watch(`rows.${index}.gstRate`) ?? 0;
                  const items = itemsMap[bookingId] || [];
                  const selectedItem = items.find(item => item.itemId === itemId);
                  return (
                    <TableRow key={field.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'white' } }}>
                      <TableCell sx={{ p: 1.5 }}>
                        <TextField
                          select
                          label="Booking ID"
                          value={bookingId}
                          onChange={(e) => handleBookingChange(index, e.target.value)}
                          fullWidth
                          sx={{ backgroundColor: 'white' }}
                        >
                          {bookings.map((bid) => <MenuItem key={bid} value={bid}>{bid}</MenuItem>)}
                        </TextField>
                      </TableCell>
                      <TableCell sx={{ p: 1.5 }}>
                        <TextField
                          select
                          label="Item"
                          value={itemId}
                          onChange={(e) => handleItemChange(index, e.target.value)}
                          fullWidth
                          sx={{ backgroundColor: 'white' }}
                        >
                          {items.map((item, idx) => <MenuItem key={idx} value={item.itemId}>{item.itemId}</MenuItem>)}
                        </TextField>
                      </TableCell>
                      <TableCell sx={{ p: 1.5 }}>
                        <TextField
                          select
                          label="Item Code"
                          value={watch(`rows.${index}.itemCode`) || ''}
                          onChange={(e) => setValue(`rows.${index}.itemCode`, e.target.value)}
                          fullWidth
                          sx={{ backgroundColor: 'white' }}
                        >
                          {(selectedItem?.codes || []).map((code, idx) => (
                            <MenuItem key={idx} value={code}>{code}</MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell sx={{ p: 1.5, fontWeight: 'medium' }}>
                        {bookingTotalsMap[bookingId]?.availableAmount ?? ''}
                      </TableCell>
                      <TableCell sx={{ p: 1.5 }}>
                        <TextField
                          label="Value"
                          type="number"
                          {...register(`rows.${index}.taxableValue`, { valueAsNumber: true })}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            setValue(`rows.${index}.taxableValue`, value);
                            calculateGST(index, value, watch(`rows.${index}.gstRate`) ?? 0);
                          }}
                          fullWidth
                          sx={{ backgroundColor: 'white' }}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 1.5 }}>
                        <TextField
                          select
                          label="GST %"
                          value={gstRate}
                          {...register(`rows.${index}.gstRate`)}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            if (gstRates.includes(value)) {
                              setValue(`rows.${index}.gstRate`, value);
                              calculateGST(index, watch(`rows.${index}.taxableValue`) || 0, value);
                            }
                          }}
                          fullWidth
                          sx={{ backgroundColor: 'white' }}
                        >
                          {gstRates.map((rate) => (
                            <MenuItem key={rate} value={rate}>{rate}%</MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                       <TableCell sx={{ p: 1.5 }}>
                        <TextField
                          label="CGST"
                          type="number"
                          value={watch(`rows.${index}.cgst`) || 0}
                          InputProps={{ readOnly: true }}
                          fullWidth
                          sx={{ backgroundColor: '#f0f0f0' }}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 1.5 }}>
                        <TextField
                          label="SGST"
                          type="number"
                          value={watch(`rows.${index}.sgst`) || 0}
                          InputProps={{ readOnly: true }}
                          fullWidth
                          sx={{ backgroundColor: '#f0f0f0' }}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 1.5 }}>
                        <TextField
                          label="IGST"
                          type="number"
                          value={watch(`rows.${index}.igst`) || 0}
                          InputProps={{ readOnly: true }}
                          fullWidth
                          sx={{ backgroundColor: '#f0f0f0' }}
                        />
                      </TableCell> 

                      {/* <TableCell sx={{ p: 1.5 }}>
  <TextField
    label="CGST"
    type="number"
    // --- Modified to allow manual input for GST ---
    // value={watch(`rows.${index}.cgst`) || 0}
    // InputProps={{ readOnly: true }}
    
    {...register(`rows.${index}.cgst`, { valueAsNumber: true })}
     InputLabelProps={{ shrink: true }}
    fullWidth
    sx={{ backgroundColor: 'white' }}
  />
</TableCell>
<TableCell sx={{ p: 1.5 }}>
  <TextField
    label="SGST"
    type="number"
    // --- Modified to allow manual input for GST ---
    // value={watch(`rows.${index}.sgst`) || 0}
    // InputProps={{ readOnly: true }}
    {...register(`rows.${index}.sgst`, { valueAsNumber: true })}
     InputLabelProps={{ shrink: true }}
    fullWidth
    sx={{ backgroundColor: 'white' }}
  />
</TableCell>
<TableCell sx={{ p: 1.5 }}>
  <TextField
    label="IGST"
    type="number"
    // --- Modified to allow manual input for GST ---
    // value={watch(`rows.${index}.igst`) || 0}
    // InputProps={{ readOnly: true }}
    {...register(`rows.${index}.igst`, { valueAsNumber: true })}
     InputLabelProps={{ shrink: true }}
    fullWidth
    sx={{ backgroundColor: 'white' }}
  />
</TableCell> */}

                      <TableCell sx={{ p: 1.5 }}>
                        <TextField
                          label="Debit"
                          type="number"
                          value={watch(`rows.${index}.debitAmount`) || 0}
                          InputProps={{ readOnly: true }}
                          fullWidth
                          sx={{ backgroundColor: '#f0f0f0' }}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 1.5 }}>
                        <TextField
                          label="HSN"
                          {...register(`rows.${index}.hsnCode`)}
                          fullWidth
                          sx={{ backgroundColor: 'white' }}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 1.5 }}>
                        <Button 
                          onClick={() => remove(index)} 
                          variant="contained" 
                          color="error"
                          startIcon={<DeleteIcon />}
                          fullWidth
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
          
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              onClick={() => append({
                bookingId: '',
                item: '',
                itemCode: '',
                debitAmount: 0,
                taxableValue: 0,
                gstRate: 0,
                cgst: 0,
                sgst: 0,
                hsnCode: ''
              })}
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              sx={{ fontWeight: 'bold' }}
            >
              Add Row
            </Button>
          </Box>
        </Paper>
        
        {/* Totals and Submit */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Total Debit Amount"
                value={
                  (watch('rows') || []).reduce(
                    (sum, row) => sum + (parseFloat(row.debitAmount) || 0),
                    0
                  ).toFixed(2)
                }
                InputProps={{ 
                  readOnly: true,
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>
                }}
                fullWidth
                sx={{ 
                  backgroundColor: 'white',
                  '& input': { fontWeight: 'bold', fontSize: '1.1rem', color: '#005899' }
                }}
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button 
            type="button" 
            variant="outlined" 
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large"
            startIcon={<SaveIcon />}
            sx={{ fontWeight: 'bold', px: 4 }}
          >
            Save Invoice Booking
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default PaymentAdvisoryForm;