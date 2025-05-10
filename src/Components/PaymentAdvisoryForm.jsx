import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, get, runTransaction } from 'firebase/database';
import { db, rtdb } from '../Firebase/firebase';
import { Button, TextField, MenuItem, Box } from '@mui/material';

const PaymentAdvisoryForm = () => {
  const { control, register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      vendorGSTIN: '',
      rows: [{ bookingId: '', item: '', debitAmount: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'rows' });

  const [vendors, setVendors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [itemsMap, setItemsMap] = useState({}); // { bookingId: [items] }

  // 👉 Fetch vendors from Firestore
  const fetchVendors = async () => {
    const querySnapshot = await getDocs(collection(db, 'masters/ONBOARDING/VENDOR'));
    const vendorList = querySnapshot.docs.map(doc => doc.data());
    setVendors(vendorList);
  };

  // 👉 Fetch all booking IDs once
  const fetchAllBookings = async () => {
    const querySnapshot = await getDocs(collection(db, 'invoices'));
    const bookingList = querySnapshot.docs.map(doc => doc.id);
    setBookings(bookingList);
  };

  useEffect(() => {
    fetchVendors();
    fetchAllBookings();
  }, []);

  // 👉 Fetch items for a selected booking ID
  const fetchItemsForBooking = async (bookingId) => {
    const invoiceDoc = await getDoc(doc(db, 'invoices', bookingId));
    if (invoiceDoc.exists()) {
      const invoiceData = invoiceDoc.data();
      const items = invoiceData.items || [];
      setItemsMap(prev => ({ ...prev, [bookingId]: items }));
    } else {
      console.warn(`Invoice not found for bookingId ${bookingId}`);
    }
  };

  const handleBookingChange = (index, bookingId) => {
    setValue(`rows.${index}.bookingId`, bookingId);
    fetchItemsForBooking(bookingId);
  };

  const onSubmit = async (data) => {
    try {
      // 1️⃣ Generate PaymentAdvisory ID
      const sequenceRef = ref(rtdb, 'paymentAdvisorySequence');
      let newSeq;
      await runTransaction(sequenceRef, (current) => {
        newSeq = (current || 0) + 1;
        return newSeq;
      });
      const advisoryId = `PA-${newSeq.toString().padStart(3, '0')}`;

      const docRef = doc(db, `paymentAdvisory/${data.vendorGSTIN}/${advisoryId}/data`);
await setDoc(docRef, { rows: data.rows, createdAt: new Date() });


      alert(`Payment Advisory ${advisoryId} saved!`);

    } catch (err) {
      console.error('Error saving advisory:', err);
      alert('Failed to save advisory');
    }
  };

  return (
    <Box p={3}>
      <h2>Create Payment Advisory</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          select
          label="Select Vendor"
          {...register('vendorGSTIN', { required: true })}
          fullWidth
          margin="normal"
        >
          {vendors.map((vendor) => (
            <MenuItem key={vendor.gstin} value={vendor.gstin}>
              {vendor.contactName} ({vendor.gstin})
            </MenuItem>
          ))}
        </TextField>

        {fields.map((field, index) => (
          <Box key={field.id} display="flex" alignItems="center" gap={2} my={2}>
            {/* Booking ID Dropdown */}
            <TextField
              select
              label="Booking ID"
              value={watch(`rows.${index}.bookingId`) || ''}
              onChange={(e) => handleBookingChange(index, e.target.value)}
              fullWidth
            >
              {bookings.map((bid) => (
                <MenuItem key={bid} value={bid}>{bid}</MenuItem>
              ))}
            </TextField>

            {/* Item Dropdown */}
            <TextField
              select
              label="Item"
              {...register(`rows.${index}.item`, { required: true })}
              value={watch(`rows.${index}.item`) || ''}
              fullWidth
            >
              {(itemsMap[watch(`rows.${index}.bookingId`)] || []).map((item, idx) => (
                <MenuItem key={idx} value={item.name}>{item.name}</MenuItem>
              ))}
            </TextField>

            {/* Debit Amount */}
            <TextField
              label="Debit Amount"
              type="number"
              {...register(`rows.${index}.debitAmount`, { valueAsNumber: true })}
              fullWidth
            />

            <Button onClick={() => remove(index)} variant="outlined" color="error">Remove</Button>
          </Box>
        ))}

        <Button onClick={() => append({ bookingId: '', item: '', debitAmount: 0 })} variant="contained" color="secondary">
          Add Row
        </Button>

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary">Save Payment Advisory</Button>
        </Box>
      </form>
    </Box>
  );
};

export default PaymentAdvisoryForm;
