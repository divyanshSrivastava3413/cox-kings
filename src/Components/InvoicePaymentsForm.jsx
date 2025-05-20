import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, query,arrayUnion } from 'firebase/firestore';
import { db, rtdb } from '../Firebase/firebase';
import { ref, runTransaction, get } from 'firebase/database';
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
  IconButton,
  Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const InvoicePaymentsForm = () => {
  const { control, register, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      vendorGSTIN: '',
      invoiceNumber: '',
      advisoryId: '',
      totalDebitAmount: 0,
      dueDate: '',
      paymentDate: '',
      remarks:'',
      items: [],
      paymentAmount: 0,
      invoices: []
    }
  });

  const [vendors, setVendors] = useState([]);
  const [advisoryOptions, setAdvisoryOptions] = useState([]);
  const [advisoryData, setAdvisoryData] = useState(null);
  const [error, setError] = useState('');
  const [nextAdvisoryId, setNextAdvisoryId] = useState('');
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [showAllocation, setShowAllocation] = useState(false);
  const [isVendorLocked, setIsVendorLocked] = useState(false);
  const [renderKey, setRenderKey] = useState(0); // For controlled re-render
  const [selectedRows, setSelectedRows] = useState([]);
  const [fetchedAdvisories, setFetchedAdvisories] = useState([]);




  const { fields: itemFields } = useFieldArray({ control, name: 'items' });
  const { fields: invoiceFields, append: appendInvoice, remove: removeInvoice } = useFieldArray({
    control,
    name: 'invoices'
  });

  const selectedVendorGSTIN = watch('vendorGSTIN');
  const invoiceNumber = watch('invoiceNumber');
  const selectedAdvisoryId = watch('advisoryId');
  const paymentAmount = watch('paymentAmount');
  const invoices = watch('invoices');

  // Debounce timer for invoice number input
  const debounceTimeout = useRef(null);

  // Lock vendor after selection
  useEffect(() => {
    if (selectedVendorGSTIN && invoices.length > 0) {
      setIsVendorLocked(true);
    } else {
      setIsVendorLocked(false);
    }
  }, [selectedVendorGSTIN, invoices]);

  // Fetch next advisory ID
  useEffect(() => {
    const fetchNextAdvisoryId = async () => {
      try {
        const sequenceRef = ref(rtdb, 'paymentAdvisorySequence');
        const snapshot = await get(sequenceRef);
        const currentSeq = snapshot.val() || 0;
        const nextSeq = currentSeq + 1;
        setNextAdvisoryId(`PA-${nextSeq.toString().padStart(3, '0')}`);
      } catch (e) {
        console.error('Error fetching advisory ID:', e);
        setError('Failed to fetch advisory ID');
      }
    };
    fetchNextAdvisoryId();
  }, []);

  // Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'masters/ONBOARDING/VENDOR'));
        const list = snapshot.docs.map(doc => doc.data());
        setVendors(list);
      } catch (e) {
        console.error('Error fetching vendors:', e);
        setError('Failed to load vendors');
      }
    };
    fetchVendors();
  }, []);

  // Fetch vendor remaining balance from invoiceBooking
  useEffect(() => {
    const fetchVendorRemainingBalance = async () => {
      if (!selectedVendorGSTIN) {
        setRemainingBalance(0);
        return;
      }
      try {
        const metadataRef = doc(db, `invoiceBooking/${selectedVendorGSTIN}/metadata/bookingIds`);
        const metadataSnap = await getDoc(metadataRef);
        const advisoryIds = metadataSnap.exists() ? metadataSnap.data().ids || [] : [];

        let totalRemaining = 0;
        for (const advisoryId of advisoryIds) {
          const invoicesQuery = query(collection(db, `invoiceBooking/${selectedVendorGSTIN}/${advisoryId}`));
          const invoicesSnap = await getDocs(invoicesQuery);
          invoicesSnap.forEach(doc => {
            const data = doc.data();
            const remaining = data.remainingAmount !== undefined ? data.remainingAmount : data.invoiceValue;
            if (remaining > 0) {
              totalRemaining += remaining;
            }
          });
        }
        setRemainingBalance(totalRemaining);
      } catch (e) {
        console.error('Error fetching vendor remaining balance:', e);
        setError('Failed to fetch vendor remaining balance');
      }
    };
    fetchVendorRemainingBalance();
  }, [selectedVendorGSTIN]);

useEffect(() => {
  if (!selectedVendorGSTIN || !invoiceNumber) {
    setAdvisoryOptions([]);
    setAdvisoryData(null);
    setValue('advisoryId', '');
    setValue('totalDebitAmount', 0);
    setValue('dueDate', '');
    setValue('items', []);
    return;
  }

  if (debounceTimeout.current) {
    clearTimeout(debounceTimeout.current);
  }

  debounceTimeout.current = setTimeout(async () => {
    try {
      const metadataRef = doc(db, `invoiceBooking/${selectedVendorGSTIN}/metadata/bookingIds`);
      const metadataSnap = await getDoc(metadataRef);
      const advisoryIds = metadataSnap.exists() ? metadataSnap.data().ids || [] : [];

      const matchingAdvisories = [];
      let foundInvoiceButFullyPaid = false;

      for (const advisoryId of advisoryIds) {
        const invoiceDocRef = doc(db, `invoiceBooking/${selectedVendorGSTIN}/${advisoryId}/${invoiceNumber}`);
        const invoiceDocSnap = await getDoc(invoiceDocRef);

        if (invoiceDocSnap.exists()) {
          const invoiceData = invoiceDocSnap.data();
          const remainingValue = invoiceData.remainingAmount !== undefined
            ? invoiceData.remainingAmount
            : invoiceData.invoiceValue;

          if (remainingValue > 0) {
            matchingAdvisories.push({
              id: advisoryId,
              ...invoiceData,
              remainingValue
            });
          } else {
            foundInvoiceButFullyPaid = true;
          }
        }
      }

      if (matchingAdvisories.length > 0) {
        setAdvisoryOptions(matchingAdvisories);
        setError('');
        if (matchingAdvisories.length === 1) {
          setValue('advisoryId', matchingAdvisories[0].id);
        } else {
          setValue('advisoryId', '');
          setAdvisoryData(null);
          setValue('totalDebitAmount', 0);
          setValue('dueDate', '');
          setValue('items', []);
        }
      } else {
        setAdvisoryOptions([]);
        setAdvisoryData(null);
        setValue('advisoryId', '');
        setValue('totalDebitAmount', 0);
        setValue('dueDate', '');
        setValue('items', []);
        setError(foundInvoiceButFullyPaid
          ? 'This invoice has already been fully paid.'
          : 'No advisories found for this invoice number');
      }
    } catch (e) {
      console.error('Error fetching advisories:', e);
      setError('Failed to fetch advisory data');
    }
  }, 500);

  return () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
  };
}, [selectedVendorGSTIN, invoiceNumber, setValue]);


  // Fetch advisory data when advisoryId is selected
  useEffect(() => {
    const fetchAdvisoryData = async () => {
      if (!selectedVendorGSTIN || !selectedAdvisoryId || !invoiceNumber) {
        setAdvisoryData(null);
        setValue('totalDebitAmount', 0);
        setValue('dueDate', '');
        setValue('items', []);
        return;
      }

      try {
        const advisoryRef = doc(db, `invoiceBooking/${selectedVendorGSTIN}/${selectedAdvisoryId}/${invoiceNumber}`);
        const advisorySnap = await getDoc(advisoryRef);

        if (advisorySnap.exists()) {
          const data = advisorySnap.data();
          const remainingValue = data.remainingAmount !== undefined ? data.remainingAmount : data.invoiceValue;

          const items = (data.rows || []).map(row => ({
            bookingId: row.bookingId || '',
            itemCode: row.itemCode || '',
            item: row.item || '',
            hsnCode: row.hsnCode || '',
            taxableValue: row.taxableValue || 0,
            cgst: row.cgst || 0,
            sgst: row.sgst || 0,
            igst: row.igst || 0,
            debitAmount: row.debitAmount || 0
          }));
          setAdvisoryData({ ...data, remainingValue, items });
          setValue('totalDebitAmount', Number(remainingValue));
          setValue('dueDate', data.dueDate || '');
          setValue('items', items);
          setError('');
        } else {
          setAdvisoryData(null);
          setValue('totalDebitAmount', 0);
          setValue('dueDate', '');
          setValue('items', []);
          setError('Selected advisory ID not found');
        }
      } catch (e) {
        console.error('Error fetching advisory:', e);
        setError('Failed to fetch advisory data');
      }
    };
    fetchAdvisoryData();
  }, [selectedVendorGSTIN, selectedAdvisoryId, invoiceNumber, setValue]);

  // Handle adding an invoice
  const handleAddInvoice = () => {
    if (!invoiceNumber || !selectedAdvisoryId || !advisoryData) {
      console.log('handleAddInvoice: Invalid input', { invoiceNumber, selectedAdvisoryId, advisoryData });
      alert('Please select a valid invoice number and advisory ID');
      return;
    }

    // Check for duplicate invoice
    const isDuplicate = invoices.some(
      invoice => invoice.invoiceNumber === invoiceNumber && invoice.advisoryId === selectedAdvisoryId
    );
    if (isDuplicate) {
      console.log('handleAddInvoice: Duplicate invoice', { invoiceNumber, selectedAdvisoryId });
      alert('This invoice and advisory ID combination is already added');
      return;
    }

    const invoiceData = {
      invoiceNumber,
      advisoryId: selectedAdvisoryId,
      allocatedAmount: 0,
      totalDebitAmount: Number(advisoryData.remainingValue),
      dueDate: advisoryData.dueDate,
      items: advisoryData.items
    };
    console.log('handleAddInvoice: Adding invoice', invoiceData);
    appendInvoice(invoiceData);
    console.log('handleAddInvoice: Invoices after append', invoices);

    setValue('invoiceNumber', '');
    setValue('advisoryId', '');
    setValue('totalDebitAmount', 0);
    setValue('dueDate', '');
    setAdvisoryOptions([]);
    setAdvisoryData(null);
    setRenderKey(prev => prev + 1); // Force re-render
  };

  // Distribute payment amount across invoices
  const distributePayment = useCallback(() => {
    console.log('distributePayment called');
    console.log('paymentAmount:', paymentAmount);
    console.log('invoices:', invoices);

    if (!paymentAmount || isNaN(paymentAmount) || Number(paymentAmount) <= 0 || invoices.length === 0) {
      console.log('Validation failed: Invalid paymentAmount or no invoices', { paymentAmount, invoicesLength: invoices.length });
      alert('Please enter a valid payment amount and add at least one invoice');
      return;
    }

    const updatedInvoices = invoices.map(invoice => ({
      ...invoice,
      allocatedAmount: 0
    }));

    let remaining = Number(paymentAmount);
    console.log('Initial remaining:', remaining);

    for (let i = 0; i < updatedInvoices.length; i++) {
      const invoiceValue = Number(updatedInvoices[i].totalDebitAmount);
      console.log(`Processing invoice ${i}: totalDebitAmount = ${invoiceValue}`);

      if (invoiceValue > 0 && remaining > 0) {
        const allocation = Math.min(invoiceValue, remaining);
        updatedInvoices[i].allocatedAmount = Number(allocation);
        remaining -= allocation;
        console.log(`Allocated ${allocation} to invoice ${i}, new remaining: ${remaining}`);
      } else {
        console.log(`Skipping invoice ${i}: totalDebitAmount = ${invoiceValue}, remaining = ${remaining}`);
      }
    }

    if (remaining > 0) {
      console.log('Excess payment amount:', remaining);
      alert('Payment amount exceeds the total remaining value of selected invoices');
      return;
    }

    console.log('Final updatedInvoices:', updatedInvoices);
    // Update each allocatedAmount individually
    updatedInvoices.forEach((invoice, index) => {
      console.log(`Setting invoices.${index}.allocatedAmount to ${invoice.allocatedAmount}`);
      setValue(`invoices.${index}.allocatedAmount`, Number(invoice.allocatedAmount), { shouldDirty: true, shouldTouch: true });
    });
    console.log('All setValue calls completed, invoices state:', watch('invoices'));
    setRenderKey(prev => prev + 1); // Force re-render
  }, [paymentAmount, invoices, setValue, watch]);

  // Show allocation section
  const handleShowAllocation = () => {
    if (invoices.length === 0) {
      alert('Please add at least one invoice');
      return;
    }
    setShowAllocation(true);
  };

  // Submit handler
 /*  const onSubmit = async (data) => {
    if (!data.invoices.some(inv => inv.advisoryId && inv.allocatedAmount > 0)) {
      alert('Please allocate amounts to at least one invoice');
      return;
    }
    if (!data.paymentDate) {
      alert('Please enter a payment date');
      return;
    }

    // Validate full allocation
    const totalAllocated = data.invoices.reduce((sum, inv) => sum + Number(inv.allocatedAmount), 0);
    if (totalAllocated !== Number(data.paymentAmount)) {
      alert('Total allocated amount must equal the payment amount');
      return;
    }

    // Validate allocated amounts against invoice remaining amounts
    for (const invoice of data.invoices) {
      if (invoice.allocatedAmount > invoice.totalDebitAmount) {
        alert(`Allocated amount for invoice ${invoice.invoiceNumber} exceeds its remaining amount`);
        return;
      }
    }

    try {
      const sequenceRef = ref(rtdb, 'paymentAdvisorySequence');
      let newSeq;
      await runTransaction(sequenceRef, current => {
        newSeq = (current || 0) + 1;
        return newSeq;
      });
      const advisoryId = `PA-${newSeq.toString().padStart(3, '0')}`;

      // Save payment advisory and update invoiceBooking
      for (const invoice of data.invoices) {
        if (invoice.allocatedAmount > 0 && invoice.advisoryId) {
          // Save to paymentAdvisory
          const paymentRef = doc(db, `paymentAdvisory/${data.vendorGSTIN}/${advisoryId}/${invoice.invoiceNumber}`);
          await setDoc(paymentRef, {
            vendorGSTIN: data.vendorGSTIN,
            paymentAdvisoryId: advisoryId,
            invoiceAdvisoryId: invoice.advisoryId,
            invoiceNumber: invoice.invoiceNumber,
            allocatedAmount: invoice.allocatedAmount,
            totalDebitAmount: invoice.totalDebitAmount,
            dueDate: invoice.dueDate,
            paymentDate: data.paymentDate,
            items: invoice.items,
            createdAt: new Date()
          });

          // Update invoiceBooking
          const invoiceRef = doc(db, `invoiceBooking/${data.vendorGSTIN}/${invoice.advisoryId}/${invoice.invoiceNumber}`);
          const invoiceSnap = await getDoc(invoiceRef);
          if (invoiceSnap.exists()) {
            const invoiceData = invoiceSnap.data();
            const currentRemaining = invoiceData.remainingAmount !== undefined ? invoiceData.remainingAmount : invoiceData.invoiceValue;
            const newRemaining = currentRemaining - invoice.allocatedAmount;
            const currentPaymentAdvisoryIds = invoiceData.paymentAdvisoryIds || [];

            await updateDoc(invoiceRef, {
              remainingAmount: newRemaining,
              paymentAdvisoryIds: [...currentPaymentAdvisoryIds, advisoryId],
              updatedAt: new Date()
            });
          }
        }
      }

      alert(`Payment Advisory ${advisoryId} saved!`);
      reset({
        vendorGSTIN: '',
        invoiceNumber: '',
        advisoryId: '',
        totalDebitAmount: 0,
        dueDate: '',
        paymentDate: '',
        items: [],
        paymentAmount: 0,
        invoices: []
      });
      setAdvisoryOptions([]);
      setAdvisoryData(null);
      setError('');
      setRemainingBalance(0);
      setShowAllocation(false);
      setIsVendorLocked(false);
      setRenderKey(0);
    } catch (err) {
      console.error('Error saving payment:', err);
      alert('Failed to save payment');
    }
  };
   */

  const onSubmit = async (data) => {
    if (!data.invoices.some(inv => inv.advisoryId && inv.allocatedAmount > 0)) {
      alert('Please allocate amounts to at least one invoice');
      return;
    }
    if (!data.paymentDate) {
      alert('Please enter a payment date');
      return;
    }
  
    // Validate full allocation
    const totalAllocated = data.invoices.reduce((sum, inv) => sum + Number(inv.allocatedAmount), 0);
    if (totalAllocated !== Number(data.paymentAmount)) {
      alert('Total allocated amount must equal the payment amount');
      return;
    }
  
    // Validate allocated amounts against invoice remaining amounts
    for (const invoice of data.invoices) {
      if (invoice.allocatedAmount > invoice.totalDebitAmount) {
        alert(`Allocated amount for invoice ${invoice.invoiceNumber} exceeds its remaining amount`);
        return;
      }
    }
  
    try {
      // Generate sequence for advisory ID
      const sequenceRef = ref(rtdb, 'paymentAdvisorySequence');
      let newSeq;
      await runTransaction(sequenceRef, current => {
        newSeq = (current || 0) + 1;
        return newSeq;
      });
      const advisoryId = `PA-${newSeq.toString().padStart(3, '0')}`;
  
      // Ensure root document exists and update advisoryIds
      const invoiceRootRef = doc(db, 'invoiceBooking', data.vendorGSTIN);
      const invoiceRootSnap = await getDoc(invoiceRootRef);
      if (invoiceRootSnap.exists()) {
        await updateDoc(invoiceRootRef, {
          advisoryIds: arrayUnion(advisoryId)
        });
      } else {
        await setDoc(invoiceRootRef, {
          advisoryIds: [advisoryId]
        });
      } 
      const paymentRootRef = doc(db, 'paymentAdvisory', data.vendorGSTIN);
      const paymentRootSnap = await getDoc(paymentRootRef);
      if (paymentRootSnap.exists()) {
        await updateDoc(paymentRootRef, {
          advisoryIds: arrayUnion(advisoryId)
        });
      } else {
        await setDoc(paymentRootRef, {
          advisoryIds: [advisoryId]
        });
      }
  
      // Save each invoice advisory and update booking
      for (const invoice of data.invoices) {
        if (invoice.allocatedAmount > 0 && invoice.advisoryId) {
          const paymentRef = doc(db, `paymentAdvisory/${data.vendorGSTIN}/${advisoryId}/${invoice.invoiceNumber}`);
          await setDoc(paymentRef, {
            vendorGSTIN: data.vendorGSTIN,
            paymentAdvisoryId: advisoryId,
            invoiceAdvisoryId: invoice.advisoryId,
            invoiceNumber: invoice.invoiceNumber,
            allocatedAmount: invoice.allocatedAmount,
            totalDebitAmount: invoice.totalDebitAmount,
            dueDate: invoice.dueDate,
            paymentDate: data.paymentDate,
            items: invoice.items,
            createdAt: new Date()
          });
  
          const invoiceRef = doc(db, `invoiceBooking/${data.vendorGSTIN}/${invoice.advisoryId}/${invoice.invoiceNumber}`);
          const invoiceSnap = await getDoc(invoiceRef);
          if (invoiceSnap.exists()) {
            const invoiceData = invoiceSnap.data();
            const currentRemaining = invoiceData.remainingAmount ?? invoiceData.invoiceValue;
            const newRemaining = currentRemaining - invoice.allocatedAmount;
  
            await updateDoc(invoiceRef, {
              remainingAmount: newRemaining,
              paymentAdvisoryIds: arrayUnion(advisoryId),
              updatedAt: new Date()
            });
          }
        }
      }
  
      alert(`Payment Advisory ${advisoryId} saved!`);
      // Reset form state
      reset({
        vendorGSTIN: '',
        invoiceNumber: '',
        advisoryId: '',
        totalDebitAmount: 0,
        dueDate: '',
        paymentDate: '',
        items: [],
        paymentAmount: 0,
        invoices: []
      });
      setAdvisoryOptions([]);
      setAdvisoryData(null);
      setError('');
      setRemainingBalance(0);
      setShowAllocation(false);
      setIsVendorLocked(false);
      setRenderKey(prev => prev + 1);
    } catch (err) {
      console.error('Error saving payment:', err);
      alert('Failed to save payment');
    }
  };
  const selectedVendor = vendors.find(v => v.gstin === watch('vendorGSTIN'));
  const handleInvoiceFetch = async (invoiceNumber) => {
  try {
    const response = await fetchAdvisories(invoiceNumber); // your existing API call
    const newAdvisories = response.data;

    // Avoid duplicates
    setFetchedAdvisories((prev) => {
      const existingIds = prev.map((a) => a.id);
      const filtered = newAdvisories.filter((a) => !existingIds.includes(a.id));
      return [...prev, ...filtered];
    });
  } catch (err) {
    console.error(err);
  }
};



  return (
    <Box p={3} sx={{ border: '1px solid gray', borderRadius: '10px', backgroundColor: 'white' }} key={renderKey}>
      <h1 className='font-bold text-3xl' style={{marginBottom:'6px'}}>Create Invoice Payment Advisory</h1>
      {/* <Box mb={3}>
        <Typography variant="h6" sx={{ color: '#333' }}>Advisory ID: {nextAdvisoryId}</Typography>
      </Box>
      <Box mb={2}>
        <Typography variant="subtitle1">
          Total Remaining Balance: {remainingBalance.toFixed(2)}
        </Typography>
      </Box> */}

  {/* REPLACE EVERYTHING UNTIL <form ...> WITH THIS: */}
  <Grid container  mb={3} sx={{display:'flex', justifyContent:'space-between',alignItems:'flex-start'}}>
    {/* Left Side */}
    <Grid item xs={12} sm={6}>
      <Typography variant="subtitle1"><strong>Payment Advice:</strong> {nextAdvisoryId}</Typography>
      <TextField
        label="Payment Date"
        type="date"
        {...register('paymentDate', { required: true })}
        defaultValue={new Date().toISOString().split('T')[0]} // autofill current date
        fullWidth
        InputLabelProps={{ shrink: true }}
        sx={{ mt: 2 }}
      />
    </Grid>

    {/* Right Side */}
    <Grid item xs={12} sm={6}>
     <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Select Vendor"
              {...register('vendorGSTIN', { required: true })}
              fullWidth
              disabled={isVendorLocked}
            >
              {vendors.map((vendor) => (
                <MenuItem key={vendor.gstin} value={vendor.gstin}>
                  {vendor.contactName} ({vendor.gstin})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

      <Typography variant="subtitle1"><strong>Vendor Name:</strong> {selectedVendor?.contactName || '-'}</Typography>
      <Typography variant="subtitle1"><strong>Vendor Address:</strong> {selectedVendor?.address || '-'}</Typography>
      <Typography variant="subtitle1" mt={1}>

        <strong>Bank Details:</strong><br />
        {selectedVendor ? (
          <>
            Bank: {selectedVendor.bankName || '-'} ({selectedVendor.bankBranch || '-'})<br />
            IFSC: {selectedVendor.ifsc || '-'}<br />
            A/C No: {selectedVendor.bankAccountNo || '-'}
          </>
        ) : (
          <>-</>
        )}
      </Typography>
    </Grid>
  </Grid>


      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
         
          <Grid item xs={12} sm={6}>
            <TextField
              label="Invoice Number"
              {...register('invoiceNumber')}
              fullWidth
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Select Advisory ID"
              {...register('advisoryId')}
              fullWidth
              disabled={advisoryOptions.length === 0}
              value={watch('advisoryId') || ''}
            >
              <MenuItem value="">Select an Advisory</MenuItem>
              {advisoryOptions.map((advisory) => (
                <MenuItem key={advisory.id} value={advisory.id}>
                  {advisory.id}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Total Debit Amount"
              type="number"
              value={watch('totalDebitAmount') || 0}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Due Date"
              type="date"
              value={watch('dueDate') || ''}
              InputProps={{ readOnly: true }}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Payment Date"
              type="date"
              {...register('paymentDate', { required: true })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Remarks"
               {...register('remarks')}
              
              
              fullWidth
            />
          </Grid>
        </Grid>
        {/* {advisoryOptions.length > 0 && (
  <Box mt={3}>
    <Typography variant="h6">Fetched Advisories</Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Select</TableCell>
            <TableCell>Vendor</TableCell>
            <TableCell>Advisory ID</TableCell>
            <TableCell>Invoice Number</TableCell>
            <TableCell>Invoice Value</TableCell>
            <TableCell>Balance Amount</TableCell>
            <TableCell>Amount Paid</TableCell>
            <TableCell>Remarks</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {advisoryOptions.map((adv, index) => (
            <TableRow key={adv.id}>
              <TableCell>
                <Checkbox
                  checked={selectedRows.includes(adv.id)}
                  onChange={() => {
                    const updated = selectedRows.includes(adv.id)
                      ? selectedRows.filter(id => id !== adv.id)
                      : [...selectedRows, adv.id];
                    setSelectedRows(updated);
                  }}
                />
              </TableCell>
              <TableCell>{selectedVendor?.contactName || '-'}</TableCell>
              <TableCell>{adv.id}</TableCell>
              <TableCell>{adv.invoiceNumber}</TableCell>
              <TableCell>{adv.invoiceValue}</TableCell>
              <TableCell>{adv.remainingAmount}</TableCell>
              <TableCell>{adv.amountPaid || 0}</TableCell>
              <TableCell>
                <TextField
                  variant="outlined"
                  size="small"
                  value={adv.remarks || ''}
                  onChange={(e) => {
                    const updated = [...advisoryOptions];
                    updated[index].remarks = e.target.value;
                    setAdvisoryOptions(updated);
                  }}
                />
              </TableCell>
              <TableCell>
                <Button
                  color="error"
                  onClick={() => {
                    setAdvisoryOptions((prev) => prev.filter((item) => item.id !== adv.id));
                    setSelectedRows((prev) => prev.filter(id => id !== adv.id));
                  }}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
)} */}

        {itemFields.length > 0 && (
          <Box mt={3}>
            <Typography variant="h6">Advisory Items</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Booking ID</TableCell>
                    <TableCell>Item Code</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>HSN Code</TableCell>
                    <TableCell>Taxable Value</TableCell>
                    <TableCell>CGST</TableCell>
                    <TableCell>SGST</TableCell>
                    <TableCell>IGST</TableCell>
                    <TableCell>Debit Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemFields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>{field.bookingId}</TableCell>
                      <TableCell>{field.itemCode}</TableCell>
                      <TableCell>{field.item}</TableCell>
                      <TableCell>{field.hsnCode}</TableCell>
                      <TableCell>{field.taxableValue}</TableCell>
                      <TableCell>{field.cgst}</TableCell>
                      <TableCell>{field.sgst}</TableCell>
                      <TableCell>{field.igst}</TableCell>
                      <TableCell>{field.debitAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={2}>
              <IconButton
                color="primary"
                onClick={handleAddInvoice}
                sx={{ border: '1px solid', borderRadius: '4px' }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        )}
        {invoiceFields.length > 0 && (
          <Box mt={3}>
            <Typography variant="h6">Added Invoices</Typography>
            {invoiceFields.map((invoice, index) => (
              <Box key={index} mt={2}>
                <Typography variant="subtitle1">
                  Invoice {index + 1}: {invoice.invoiceNumber} (Advisory ID: {invoice.advisoryId})
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Booking ID</TableCell>
                        <TableCell>Item Code</TableCell>
                        <TableCell>Item</TableCell>
                        <TableCell>HSN Code</TableCell>
                        <TableCell>Taxable Value</TableCell>
                        <TableCell>CGST</TableCell>
                        <TableCell>SGST</TableCell>
                        <TableCell>IGST</TableCell>
                        <TableCell>Debit Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoice.items && invoice.items.map((item, itemIndex) => (
                        <TableRow key={itemIndex}>
                          <TableCell>{item.bookingId}</TableCell>
                          <TableCell>{item.itemCode}</TableCell>
                          <TableCell>{item.item}</TableCell>
                          <TableCell>{item.hsnCode}</TableCell>
                          <TableCell>{item.taxableValue}</TableCell>
                          <TableCell>{item.cgst}</TableCell>
                          <TableCell>{item.sgst}</TableCell>
                          <TableCell>{item.igst}</TableCell>
                          <TableCell>{item.debitAmount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box mt={1}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeInvoice(index)}
                  >
                    Remove Invoice
                  </Button>
                </Box>
              </Box>
            ))}
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleShowAllocation}
              >
                Proceed to Allocation
              </Button>
            </Box>
          </Box>
        )}
        {showAllocation && (
          <Box mt={3}>
            <Typography variant="h6">Payment Allocation</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Total Payment Amount"
                  type="number"
                  {...register('paymentAmount', { required: true, min: 0, valueAsNumber: true })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={distributePayment}
                  disabled={!paymentAmount || Number(paymentAmount) <= 0}
                >
                  Allocate Amount
                </Button>
              </Grid>
            </Grid>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice Number</TableCell>
                    <TableCell>Advisory ID</TableCell>
                    <TableCell>Remaining Value</TableCell>
                    <TableCell>Allocated Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.map((invoice, index) => (
                    <TableRow key={index}>
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.advisoryId}</TableCell>
                      <TableCell>{invoice.totalDebitAmount}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          {...register(`invoices.${index}.allocatedAmount`, {
                            required: true,
                            min: 0,
                            valueAsNumber: true
                          })}
                          fullWidth
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary">Save Payment Advisory</Button>
        </Box>
      </form>
    </Box>
  );
};

export default InvoicePaymentsForm;