import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Autocomplete, TextField, Button, Chip } from '@mui/material';
import { db } from '../Firebase/firebase';
import { collection, doc, getDocs, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Upload } from "lucide-react"

const PaymentRecon = () => {
  const [data, setData] = useState([]);
  const [bookingIds, setBookingIds] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [paymentAdvisoryIds, setPaymentAdvisoryIds] = useState({});
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);

  // Fetch booking IDs and vendors from Firestore
  const fetchData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'bookings'));
      const ids = querySnapshot.docs.map(doc => doc.id).sort();
      setBookingIds(ids);

      const vendorSnapshot = await getDocs(collection(db, 'masters/ONBOARDING/VENDOR'));
      const vendorList = vendorSnapshot.docs.map(doc => doc.data());
      setVendors(vendorList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch payment advisory IDs for a vendor
  const fetchPaymentAdvisoryIds = async (vendorGSTIN) => {
    console.log(`Fetching payment advisory IDs for vendorGSTIN: ${vendorGSTIN}`);
    if (!vendorGSTIN) {
      console.log('No vendorGSTIN provided, returning empty array');
      setPaymentAdvisoryIds(prev => ({ ...prev, [vendorGSTIN || '']: [] }));
      return [];
    }
    try {
      const vendorDocRef = doc(db, `paymentAdvisory/${vendorGSTIN}`);
      const vendorDocSnap = await getDoc(vendorDocRef);
      console.log(`Vendor document exists: ${vendorDocSnap.exists()}`);
      if (!vendorDocSnap.exists()) {
        console.log(`No document found for paymentAdvisory/${vendorGSTIN}`);
        setPaymentAdvisoryIds(prev => ({ ...prev, [vendorGSTIN]: [] }));
        return [];
      }

      const vendorData = vendorDocSnap.data();
      const ids = Array.isArray(vendorData.advisoryIds) ? vendorData.advisoryIds : [];
      console.log(`Fetched paymentAdvisoryIds from advisoryIds field:`, ids);
      setPaymentAdvisoryIds(prev => {
        const newState = { ...prev, [vendorGSTIN]: ids.sort() };
        console.log('Updated paymentAdvisoryIds state:', newState);
        return newState;
      });
      return ids.sort();
    } catch (error) {
      console.error('Error fetching payment advisory IDs:', error);
      setPaymentAdvisoryIds(prev => ({ ...prev, [vendorGSTIN]: [] }));
      return [];
    }
  };

  // Fetch total allocated amount for a payment advisory ID
  const fetchAllocatedAmount = async (vendorGSTIN, paymentAdvisoryId) => {
    if (!vendorGSTIN || !paymentAdvisoryId) return 0;
    try {
      const invoicesSnapshot = await getDocs(collection(db, `paymentAdvisory/${vendorGSTIN}/${paymentAdvisoryId}`));
      let totalAllocatedAmount = 0;
      invoicesSnapshot.forEach(doc => {
        const invoiceData = doc.data();
        const allocatedAmount = Number(invoiceData.allocatedAmount || 0);
        console.log(`Invoice ${doc.id}: allocatedAmount = ${allocatedAmount}`);
        totalAllocatedAmount += allocatedAmount;
      });
      console.log(`Total allocatedAmount for ${vendorGSTIN}/${paymentAdvisoryId}: ${totalAllocatedAmount}`);
      return totalAllocatedAmount;
    } catch (error) {
      console.error('Error fetching allocated amount:', error);
      return 0;
    }
  };

  // Validate debit row against payment advisory
  const validateDebitRow = async (vendorGSTIN, paymentAdvisoryId, withdrawalsDr) => {
    console.log(`Validating debit row for vendorGSTIN: ${vendorGSTIN}, paymentAdvisoryId: ${paymentAdvisoryId}, withdrawalsDr: ${withdrawalsDr}`);
    try {
      const totalAllocatedAmount = await fetchAllocatedAmount(vendorGSTIN, paymentAdvisoryId);
      console.log(`Total allocatedAmount: ${totalAllocatedAmount}, Withdrawals (Dr): ${withdrawalsDr}`);
      return totalAllocatedAmount === Number(withdrawalsDr);
    } catch (error) {
      console.error('Error validating debit row:', error);
      return false;
    }
  };

  // Generate unique ref ID if Cheque/Ref No. is empty
  const generateRefId = () => {
    return `ref_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFileName(file);
    const reader = new FileReader();

    reader.onload = (evt) => {
      const arrayBuffer = evt.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      const enrichedData = jsonData.map(row => ({
        Date: row.Date || '',
        'Transaction Description': row['Transaction Description'] || '',
        'Deposits (Cr)': Number(row['Deposits (Cr)'] || 0),
        'Withdrawals (Dr)': Number(row['Withdrawals (Dr)'] || 0),
        Balance: Number(row.Balance || 0),
        'Cheque/Ref No.': row['Cheque/Ref No.'] || generateRefId(),
        bookingIds: [],
        vendorGSTIN: '',
        paymentAdvisoryId: '',
        allocatedAmount: 0,
        remarks: '',
        saved: false
      }));

      console.log('Parsed & enriched Data:', enrichedData);
      setData(enrichedData);
    };

    reader.readAsArrayBuffer(file);
  };

  // Handle booking ID change
  const handleBookingChange = (value, index) => {
    const updatedData = [...data];
    updatedData[index].bookingIds = Array.isArray(value) ? value : [value].filter(Boolean);
    setData(updatedData);
  };

  // Handle vendor change and fetch payment advisory IDs
  const handleVendorChange = async (value, index) => {
    console.log(`Vendor changed to: ${value} for row ${index}`);
    const updatedData = [...data];
    updatedData[index].vendorGSTIN = value || '';
    updatedData[index].paymentAdvisoryId = '';
    updatedData[index].allocatedAmount = 0;
    setData(updatedData);

    await fetchPaymentAdvisoryIds(value);
  };

  // Handle payment advisory ID change
  const handlePaymentAdvisoryChange = async (value, index) => {
    console.log(`Payment advisory ID changed to: ${value} for row ${index}`);
    const updatedData = [...data];
    updatedData[index].paymentAdvisoryId = value || '';
    const allocatedAmount = value
      ? await fetchAllocatedAmount(updatedData[index].vendorGSTIN, value)
      : 0;
    updatedData[index].allocatedAmount = allocatedAmount;
    setData(updatedData);
  };

  // Handle save action for a single row
  const handleSave = async (index) => {
    const row = data[index];
    console.log(`Saving row ${index}:`, row);
    const isDebit = row['Withdrawals (Dr)'] > 0;
    const isCredit = row['Deposits (Cr)'] > 0;

    if (!isDebit && !isCredit) {
      alert('Row must have a Debit or Credit amount.');
      return;
    }

    if (isDebit && (!row.vendorGSTIN || !row.paymentAdvisoryId)) {
      alert('Please select a Vendor and Payment Advisory ID for debit row.');
      return;
    }

    if (isCredit && (!row.bookingIds || row.bookingIds.length === 0)) {
      alert('Please select at least one Booking ID for credit row.');
      return;
    }

    const remarks = document.getElementById(`remarks-${index}`)?.value || '';
    const refId = row['Cheque/Ref No.'] || generateRefId();

    try {
      if (isDebit) {
        const debitDocRef = doc(db, `bankstatement/${refId}`);
        const debitSnap = await getDoc(debitDocRef);
        if (debitSnap.exists()) {
          alert('This debit payment is already saved.');
          return;
        }

        const isValidDebit = await validateDebitRow(row.vendorGSTIN, row.paymentAdvisoryId, row['Withdrawals (Dr)']);
        if (!isValidDebit) {
          alert('This row does not belong to this payment advisory.');
          return;
        }
      } else {
        for (const bookingId of row.bookingIds) {
          const bookingRef = doc(db, `bookings/${bookingId}`);
          const bookingSnap = await getDoc(bookingRef);
          if (!bookingSnap.exists()) {
            alert(`Booking ID ${bookingId} not found.`);
            return;
          }
          const bookingData = bookingSnap.data();
          const existingRefIds = bookingData.ref_ids || [];
          if (existingRefIds.includes(refId)) {
            alert(`This reference ID (${refId}) is already saved for booking ID: ${bookingId}`);
            return;
          }
        }
      }

      if (isDebit) {
        const advisoryRef = doc(db, `paymentAdvisory/${row.vendorGSTIN}`);
        const advisorySnap = await getDoc(advisoryRef);
        if (!advisorySnap.exists()) {
          alert(`No document found for paymentAdvisory/${row.vendorGSTIN}`);
          return;
        }

        const paymentDocRef = doc(db, `bankstatement/${refId}`);
        await setDoc(paymentDocRef, {
          Date: row.Date,
          'Transaction Description': row['Transaction Description'],
          'Deposits (Cr)': Number(row['Deposits (Cr)']),
          'Withdrawals (Dr)': Number(row['Withdrawals (Dr)']),
          Balance: Number(row.Balance),
          'Cheque/Ref No.': refId,
          vendorGSTIN: row.vendorGSTIN,
          paymentAdvisoryId: row.paymentAdvisoryId,
          bookingIds: [],
          remarks,
          timestamp: new Date()
        });
        const advisoryDocRef = doc(db, `paymentAdvisory/${row.vendorGSTIN}/${row.paymentAdvisoryId}/01`);
await updateDoc(advisoryDocRef, {
  refId: refId
});


        alert(`Debit payment saved for Payment Advisory ID: ${row.paymentAdvisoryId}`);
      } else {
        const creditAmount = Number(row['Deposits (Cr)']);
        const allocations = [];
        let remainingCredit = creditAmount;

        let totalToPay = 0;
        const toPayMap = new Map();
        const creditRemainingMap = new Map();

        for (const bookingId of row.bookingIds) {
          const bookingRef = doc(db, `bookings/${bookingId}`);
          const bookingSnap = await getDoc(bookingRef);
          if (!bookingSnap.exists()) {
            alert(`Booking ID ${bookingId} not found.`);
            return;
          }
          const bookingData = bookingSnap.data();
          const toPay = Number(bookingData.toPay || 0);
          const currentCreditRemaining = Number(bookingData.credit_remaining || toPay);
          toPayMap.set(bookingId, toPay);
          creditRemainingMap.set(bookingId, currentCreditRemaining);
          totalToPay += currentCreditRemaining;
        }

        if (creditAmount > totalToPay) {
          alert('Credit amount exceeds the total credit_remaining of selected booking IDs. Please adjust the booking IDs.');
          return;
        }

        if (row.bookingIds.length > 1 && creditRemainingMap.get(row.bookingIds[0]) >= creditAmount) {
          alert('Credit amount is fully covered by the first booking ID. Please remove additional booking IDs.');
          return;
        }

        for (const bookingId of row.bookingIds) {
          if (remainingCredit <= 0) break;
          const creditRemaining = creditRemainingMap.get(bookingId);
          const allocation = Math.min(creditRemaining, remainingCredit);
          if (allocation > 0) {
            allocations.push({ bookingId, amount: allocation });
            remainingCredit -= allocation;
          }
        }

        for (const alloc of allocations) {
          const paymentDocRef = doc(db, `bookings/${alloc.bookingId}/payments`, refId);
          await setDoc(paymentDocRef, {
            Date: row.Date,
            'Transaction Description': row['Transaction Description'],
            'Deposits (Cr)': alloc.amount,
            'Withdrawals (Dr)': Number(row['Withdrawals (Dr)']),
            Balance: Number(row.Balance),
            'Cheque/Ref No.': refId,
            vendorGSTIN: row.vendorGSTIN || '',
            paymentAdvisoryId: row.paymentAdvisoryId || '',
            bookingIds: row.bookingIds,
            remarks,
            timestamp: new Date()
          });

          const bookingRef = doc(db, `bookings/${alloc.bookingId}`);
          const currentCreditRemaining = creditRemainingMap.get(alloc.bookingId);
          const newCreditRemaining = Math.max(0, currentCreditRemaining - alloc.amount);
          const bookingSnap = await getDoc(bookingRef);
          const existingRefIds = bookingSnap.data().ref_ids || [];
          await updateDoc(bookingRef, {
            credit_remaining: newCreditRemaining,
            ref_ids: [...existingRefIds, refId]
          });
        }

        alert(`Credit payment saved, credit_remaining and ref_ids updated for booking IDs: ${row.bookingIds.join(', ')}`);
      }

      const updatedData = [...data];
      updatedData[index] = { ...row, saved: true, remarks, 'Cheque/Ref No.': refId };
      setData(updatedData);
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('Error saving payment. Check console for details.');
    }
  };

  return (
    // <div style={{ padding: '4', backgroundColor: 'white', width: '75vw', borderRadius: '10px' }}>
    //   <span className="font-semibold text-3xl h-18 flex justify-start items-start">Payment Reconciliation</span>
    //   <div className="w-full">
    //     <h2 className="font-semibold text-xl mb-4">Upload Bank Statement</h2>
    //     <label
    //       htmlFor="file-upload"
    //       className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl w-full h-48 cursor-pointer hover:border-[#005899] hover:bg-gray-50 transition"
    //     >
    //       <UploadFileIcon className="text-black" style={{ fontSize: '60px' }} />
    //       <p className="mt-2 text-base">
    //         Selected file: {fileName ? fileName.name : 'No file selected'}
    //       </p>
    //       <input
    //         id="file-upload"
    //         type="file"
    //         accept=".xlsx,.xls"
    //         onChange={handleFileUpload}
    //         className="hidden"
    //       />
    //     </label>
    //   </div>

    //   {data.length > 0 && (
    //     <div style={{ overflowX: 'auto', marginTop: '20px' }}>
    //       <table
    //         style={{
    //           borderCollapse: 'collapse',
    //           width: '100%',
    //           minWidth: '1000px',
    //         }}
    //       >
    //         <thead>
    //           <tr>
    //             {Object.keys(data[0])
    //               .filter(key => key !== 'saved')
    //               .map(key => (
    //                 <th
    //                   key={key}
    //                   style={{
    //                     border: '1px solid #ccc',
    //                     padding: '8px',
    //                     background: '#f4f4f4',
    //                     textAlign: 'left',
    //                     whiteSpace: 'nowrap',
    //                   }}
    //                 >
    //                   {key === 'allocatedAmount' ? 'Allocated Amount' : key}
    //                 </th>
    //               ))}
    //             <th
    //               style={{
    //                 border: '1px solid #ccc',
    //                 padding: '8px',
    //                 background: '#f4f4f4',
    //                 textAlign: 'left',
    //                 whiteSpace: 'nowrap',
    //               }}
    //             >
    //               Action
    //             </th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {data.map((row, index) => {
    //             const isDebit = row['Withdrawals (Dr)'] > 0;
    //             const isCredit = row['Deposits (Cr)'] > 0;
    //             return (
    //               <tr key={index}>
    //                 {Object.keys(row)
    //                   .filter(key => key !== 'saved')
    //                   .map((key, idx) => (
    //                     <td
    //                       key={idx}
    //                       style={{
    //                         border: '1px solid #ddd',
    //                         padding: '8px',
    //                         verticalAlign: 'top',
    //                         whiteSpace: 'nowrap',
    //                         overflow: 'hidden',
    //                         textOverflow: 'ellipsis',
    //                         maxWidth: '200px',
    //                       }}
    //                     >
    //                       {key === 'bookingIds' ? (
    //                         <Autocomplete
    //                           multiple={isCredit}
    //                           value={isCredit ? row.bookingIds : (row.bookingIds[0] || '')}
    //                           onChange={(event, newValue) => handleBookingChange(newValue, index)}
    //                           options={bookingIds}
    //                           renderInput={params => (
    //                             <TextField {...params} label={isCredit ? 'Booking IDs' : 'Booking ID'} />
    //                           )}
    //                           getOptionLabel={option => String(option)}
    //                           freeSolo={false}
    //                           disabled={row.saved || isDebit}
    //                           renderTags={(value, getTagProps) =>
    //                             value.map((option, index) => (
    //                               <Chip label={option} {...getTagProps({ index })} key={index} />
    //                             ))
    //                           }
    //                         />
    //                       ) : key === 'vendorGSTIN' ? (
    //                         <Autocomplete
    //                           value={row.vendorGSTIN || ''}
    //                           onChange={(event, newValue) => handleVendorChange(newValue, index)}
    //                           options={vendors.map(v => v.gstin)}
    //                           renderInput={params => <TextField {...params} label="Vendor GSTIN" />}
    //                           getOptionLabel={option => {
    //                             const vendor = vendors.find(v => v.gstin === option);
    //                             return vendor ? `${vendor.contactName} (${vendor.gstin})` : option;
    //                           }}
    //                           freeSolo={false}
    //                           disabled={row.saved || isCredit}
    //                         />
    //                       ) : key === 'paymentAdvisoryId' ? (
    //                         <Autocomplete
    //                           value={row.paymentAdvisoryId || ''}
    //                           onChange={(event, newValue) => handlePaymentAdvisoryChange(newValue, index)}
    //                           options={paymentAdvisoryIds[row.vendorGSTIN] || []}
    //                           renderInput={params => <TextField {...params} label="Payment Advisory ID" />}
    //                           getOptionLabel={option => String(option)}
    //                           freeSolo={false}
    //                           disabled={row.saved || !row.vendorGSTIN || isCredit}
    //                           renderOption={(props, option) => (
    //                             <li {...props} key={option}>{option}</li>
    //                           )}
    //                         />
    //                       ) : key === 'remarks' ? (
    //                         <TextField
    //                           id={`remarks-${index}`}
    //                           defaultValue={row.remarks}
    //                           placeholder="Remarks"
    //                           size="small"
    //                           disabled={row.saved}
    //                           fullWidth
    //                         />
    //                       ) : key === 'allocatedAmount' ? (
    //                         row.allocatedAmount.toFixed(2)
    //                       ) : (
    //                         String(row[key])
    //                       )}
    //                     </td>
    //                   ))}
    //                 <td
    //                   style={{
    //                     border: '1px solid #ddd',
    //                     padding: '8px',
    //                     textAlign: 'center',
    //                     whiteSpace: 'nowrap',
    //                   }}
    //                 >
    //                   {row.saved ? (
    //                     <span style={{ color: 'green', fontWeight: 'bold' }}>Saved</span>
    //                   ) : (
    //                     <Button
    //                       variant="contained"
    //                       color="primary"
    //                       onClick={() => handleSave(index)}
    //                     >
    //                       Save
    //                     </Button>
    //                   )}
    //                 </td>
    //               </tr>
    //             );
    //           })}
    //         </tbody>
    //       </table>
    //     </div>
    //   )}
    // </div>
        <div
      style={{
        padding: "32px",
        backgroundColor: "white",
        width: "75vw",
        maxWidth: "1200px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        margin: "20px auto",
      }}
    >
      <h1
        style={{
          margin: "0 0 32px 0",
          padding: "0 0 16px 0",
          borderBottom: "1px solid #eaeaea",
        }}
        className="font-semibold text-3xl text-gray-800"
      >
        Payment Reconciliation
      </h1>

      <div style={{ margin: "0 0 32px 0" }}>
        <h2 style={{ margin: "0 0 16px 0" }} className="font-semibold text-xl text-gray-700">
          Upload Bank Statement
        </h2>

        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 bg-gray-50 hover:bg-blue-50 hover:border-blue-400"
          style={{
            padding: "32px 16px",
            margin: "0",
            height: "200px",
          }}
        >
          <div className="flex flex-col items-center">
            <Upload
              className={`${fileName ? "text-blue-600" : "text-gray-400"} transition-colors duration-200`}
              style={{ width: "64px", height: "64px" }}
            />

            <p style={{ margin: "16px 0 0 0" }} className="text-base">
              {fileName ? (
                <span className="font-medium text-blue-600">Selected: {fileName.name}</span>
              ) : (
                <span className="text-gray-500">Drag & drop your Excel file or click to browse</span>
              )}
            </p>

            <p style={{ margin: "8px 0 0 0" }} className="text-xs text-gray-400">
              Supported formats: .xlsx, .xls
            </p>
          </div>

          <input id="file-upload" type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {data.length > 0 && (
        <div style={{ margin: "32px 0 0 0" }}>
          <h2 style={{ margin: "0 0 16px 0" }} className="font-semibold text-xl text-gray-700">
            Reconciliation Data
          </h2>

          <div
            style={{
              overflowX: "auto",
              margin: "0",
              borderRadius: "8px",
              border: "1px solid #eaeaea",
            }}
            className="shadow-sm"
          >
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                minWidth: "1000px",
              }}
            >
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(data[0])
                    .filter((key) => key !== "saved")
                    .map((key) => (
                      <th
                        key={key}
                        style={{
                          padding: "12px 16px",
                          borderBottom: "2px solid #ddd",
                          textAlign: "left",
                          whiteSpace: "nowrap",
                        }}
                        className="font-semibold text-gray-700"
                      >
                        {key === "allocatedAmount" ? "Allocated Amount" : key}
                      </th>
                    ))}
                  <th
                    style={{
                      padding: "12px 16px",
                      borderBottom: "2px solid #ddd",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                    className="font-semibold text-gray-700"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => {
                  const isDebit = row["Withdrawals (Dr)"] > 0
                  const isCredit = row["Deposits (Cr)"] > 0
                

                  return (
                    <tr key={index} className={` hover:bg-gray-50 transition-colors duration-150`}>
                      {Object.keys(row)
                        .filter((key) => key !== "saved")
                        .map((key, idx) => (
                          <td
                            key={idx}
                            style={{
                              padding: "12px 16px",
                              borderBottom: "1px solid #eaeaea",
                              verticalAlign: "middle",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "200px",
                            }}
                            // className={
                            //   key === "Withdrawals (Dr)" && isDebit
                            //     ? "text-red-600"
                            //     : key === "Deposits (Cr)" && isCredit
                            //       ? "text-green-600"
                            //       : ""
                            // }
                          >
                            {key === "bookingIds" ? (
                              <div style={{ padding: "4px 0" }}>
                                <Autocomplete
                                  multiple={isCredit}
                                  value={isCredit ? row.bookingIds : row.bookingIds[0] || ""}
                                  onChange={(event, newValue) => handleBookingChange(newValue, index)}
                                  options={bookingIds}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label={isCredit ? "Booking IDs" : "Booking ID"}
                                      size="small"
                                      className="bg-white"
                                    />
                                  )}
                                  getOptionLabel={(option) => String(option)}
                                  freeSolo={false}
                                  disabled={row.saved || isDebit}
                                  renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                      <Chip
                                        label={option}
                                        {...getTagProps({ index })}
                                        key={index}
                                        size="small"
                                        className="bg-blue-100 text-blue-800"
                                      />
                                    ))
                                  }
                                  size="small"
                                />
                              </div>
                            ) : key === "vendorGSTIN" ? (
                              <div style={{ padding: "4px 0" }}>
                                <Autocomplete
                                  value={row.vendorGSTIN || ""}
                                  onChange={(event, newValue) => handleVendorChange(newValue, index)}
                                  options={vendors.map((v) => v.gstin)}
                                  renderInput={(params) => (
                                    <TextField {...params} label="Vendor GSTIN" size="small" className="bg-white" />
                                  )}
                                  getOptionLabel={(option) => {
                                    const vendor = vendors.find((v) => v.gstin === option)
                                    return vendor ? `${vendor.contactName} (${vendor.gstin})` : option
                                  }}
                                  freeSolo={false}
                                  disabled={row.saved || isCredit}
                                  size="small"
                                />
                              </div>
                            ) : key === "paymentAdvisoryId" ? (
                              <div style={{ padding: "4px 0" }}>
                                <Autocomplete
                                  value={row.paymentAdvisoryId || ""}
                                  onChange={(event, newValue) => handlePaymentAdvisoryChange(newValue, index)}
                                  options={paymentAdvisoryIds[row.vendorGSTIN] || []}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Payment Advisory ID"
                                      size="small"
                                      className="bg-white"
                                    />
                                  )}
                                  getOptionLabel={(option) => String(option)}
                                  freeSolo={false}
                                  disabled={row.saved || !row.vendorGSTIN || isCredit}
                                  renderOption={(props, option) => (
                                    <li {...props} key={option}>
                                      {option}
                                    </li>
                                  )}
                                  size="small"
                                />
                              </div>
                            ) : key === "remarks" ? (
                              <div style={{ padding: "4px 0" }}>
                                <TextField
                                  id={`remarks-${index}`}
                                  defaultValue={row.remarks}
                                  placeholder="Remarks"
                                  size="small"
                                  disabled={row.saved}
                                  fullWidth
                                  className="bg-white"
                                />
                              </div>
                            ) : key === "allocatedAmount" ? (
                              <span className="font-medium">{row.allocatedAmount.toFixed(2)}</span>
                            ) : (
                              <span className={key === "Date" ? "font-medium" : ""}>{String(row[key])}</span>
                            )}
                          </td>
                        ))}
                      <td
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid #eaeaea",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.saved ? (
                          <div className="flex items-center justify-center">
                            <span
                              style={{
                                padding: "6px 12px",
                                borderRadius: "4px",
                                margin: "0",
                              }}
                              className="   font-medium text-sm"
                            >
                              ✓ Saved
                            </span>
                          </div>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSave(index)}
                            size="small"
                            className="bg-blue-600 hover:bg-blue-700"
                            style={{ margin: "0" }}
                          >
                            Save
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div
            style={{
              margin: "16px 0 0 0",
              padding: "12px 16px",
              borderRadius: "8px",
            }}
            className="bg-gray-50 text-sm text-gray-500"
          >
           
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentRecon;