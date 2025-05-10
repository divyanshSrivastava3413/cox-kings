// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import { Autocomplete, TextField, Button } from '@mui/material';
// import { db } from '../Firebase/firebase'; // Import Firestore
// import { collection, getDoc, getDocs } from 'firebase/firestore';

// const PaymentRecon = () => {
//   const [data, setData] = useState([]);
//   const [bookingIds, setBookingIds] = useState([]); // State for Booking IDs
//   const [loading, setLoading] = useState(false);

//   // Fetch booking IDs from Firestore
//   const fetchBookingIds = async () => {
//     setLoading(true);
//     try {
//       const querySnapshot = await getDocs(collection(db, "invoices"));
//       const ids = querySnapshot.docs.map(doc => doc.data().bookingId); // Assuming the field is 'bookingId'
//       setBookingIds(ids);
//     } catch (error) {
//       console.error("Error fetching Booking IDs:", error);
//     }
//     setLoading(false);
//   };

//   // Call fetchBookingIds when component mounts
//   useEffect(() => {
//     fetchBookingIds();
//   }, []);

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (evt) => {
//       const arrayBuffer = evt.target.result;
//       const workbook = XLSX.read(arrayBuffer, { type: 'array' });
//       const sheetName = workbook.SheetNames[0]; // pick first sheet
//       const sheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

//       console.log('Parsed Data:', jsonData);
//       setData(jsonData);
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   const handleBookingChange = (value, index) => {
//     const updatedData = [...data];
//     updatedData[index].bookingId = value;
//     setData(updatedData);
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Bank Statement Upload</h2>
//       <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

//       {loading && <p>Loading Booking IDs...</p>}

//       {data.length > 0 && (
//         <table border="1" cellPadding="5" style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr>
//               {Object.keys(data[0]).map((key) => (
//                 <th key={key}>{key}</th>
//               ))}
//               <th>Booking ID</th>
//               <th>Action</th>
//               <th>Remarks</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, index) => (
//               <tr key={index}>
//                 {Object.values(row).map((value, idx) => (
//                   <td key={idx}>{value}</td>
//                 ))}
//                 <td>
//                   <Autocomplete
//                     value={row.bookingId || ''}
//                     onChange={(event, newValue) => handleBookingChange(newValue, index)}
//                     options={bookingIds}
//                     renderInput={(params) => <TextField {...params} label="Booking ID" />}
//                     getOptionLabel={(option) => option}
//                     freeSolo
//                   />
//                 </td>
//                 <td>
//                   <Button variant="contained" color="primary">Save</Button>
//                 </td>
//                 <td>
//                   <input type="text" placeholder="Remarks" />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default PaymentRecon;

// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import { Autocomplete, TextField, Button } from '@mui/material';
// import { db } from '../Firebase/firebase';
// import { addDoc, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';


// const PaymentRecon = () => {
//   const [data, setData] = useState([]);
//   const [bookingIds, setBookingIds] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch booking IDs from Firestore
//   const fetchBookingIds = async () => {
//     setLoading(true);
//     try {
//       const querySnapshot = await getDocs(collection(db, "invoices"));
//       const ids = querySnapshot.docs.map(doc => doc.data().bookingId); // Assuming the field is 'bookingId'
//       setBookingIds(ids);
//     } catch (error) {
//       console.error("Error fetching Booking IDs:", error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchBookingIds();
//   }, []);

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (evt) => {
//       const arrayBuffer = evt.target.result;
//       const workbook = XLSX.read(arrayBuffer, { type: 'array' });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

//       const enrichedData = jsonData.map(row => ({
//         ...row,
//         bookingId: '',
//         remarks: ''
//       }));

//       console.log('Parsed Data:', enrichedData);
//       setData(enrichedData);
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   const handleBookingChange = (value, index) => {
//     const updatedData = [...data];
//     updatedData[index].bookingId = value;
//     setData(updatedData);
//   };

//   const handleRemarksChange = (value, index) => {
//     const updatedData = [...data];
//     updatedData[index].remarks = value;
//     setData(updatedData);
//   };

//   const handleSave = async (index) => {
//     const row = data[index];
//     if (!row.bookingId) {
//       alert("Please select a Booking ID before saving.");
//       return;
//     }
//     const bookingId = row.bookingId.toString();  // Ensure it’s a string

//     try {
//         const paymentDocRef = doc(db, "invoices", bookingId, "payments", `${new Date()}`);

//         await setDoc(paymentDocRef, {
//           ...row,
//           timestamp: new Date(),
//         });
//       alert(`Payment saved under booking ID ${row.bookingId}`);
//        // ✅ Update UI to mark this row as saved
//     const updatedData = [...data];
//     updatedData[index] = { ...row, saved: true };
//     setData(updatedData);
//     } catch (error) {
//       console.error("Error saving payment:", error);
//       alert("Error saving payment. Check console for details.");
//     }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Bank Statement Upload</h2>
//       <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

//       {loading && <p>Loading Booking IDs...</p>}

//       {data.length > 0 && (
//         <table border="1" cellPadding="5" style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
//           <thead>
//             <tr>
//               {Object.keys(data[0]).map((key) => (
//                 <th key={key}>{key}</th>
//               ))}
//               <th>Booking ID</th>
//               <th>Action</th>
//               <th>Remarks</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, index) => (
//               <tr key={index}>
//                 {Object.values(row).map((value, idx) => (
//                   <td key={idx}>{value}</td>
//                 ))}
//                 <td>
//                 <Autocomplete
//   value={row.bookingId}
//   onChange={(event, newValue) => handleBookingChange(newValue, index)}
//   options={bookingIds}
//   renderInput={(params) => <TextField {...params} label="Booking ID" />}
//   getOptionLabel={(option) => option.toString()} // Ensure it’s a string
//   freeSolo
// />

//                 </td>
//                 <td>
//                   <Button variant="contained" color="primary" onClick={() => handleSave(index)}>Save</Button>
//                 </td>
//                 <td>
//                   <TextField
//                     value={row.remarks}
//                     onChange={(e) => handleRemarksChange(e.target.value, index)}
//                     placeholder="Remarks"
//                     size="small"
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default PaymentRecon;

// import React, { useState, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import { Autocomplete, TextField, Button } from '@mui/material';
// import { db } from '../Firebase/firebase';
// import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

// const PaymentRecon = () => {
//   const [data, setData] = useState([]);
//   const [bookingIds, setBookingIds] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch booking IDs from Firestore
//   const fetchBookingIds = async () => {
//     setLoading(true);
//     try {
//       const querySnapshot = await getDocs(collection(db, "invoices"));
//       const ids = querySnapshot.docs.map(doc => doc.data().bookingId);
//       setBookingIds(ids);
//     } catch (error) {
//       console.error("Error fetching Booking IDs:", error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchBookingIds();
//   }, []);

// //   const handleFileUpload = (e) => {
// //     const file = e.target.files[0];
// //     const reader = new FileReader();

// //     reader.onload = (evt) => {
// //       const arrayBuffer = evt.target.result;
// //       const workbook = XLSX.read(arrayBuffer, { type: 'array' });
// //       const sheetName = workbook.SheetNames[0];
// //       const sheet = workbook.Sheets[sheetName];
// //       const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

// //       const enrichedData = jsonData.map(row => ({
// //         ...row,
// //         bookingId: '',
// //         remarks: '',
// //       }));

// //       console.log('Parsed Data:', enrichedData);
// //       setData(enrichedData);
// //     };

// //     reader.readAsArrayBuffer(file);
// //   };

// const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
  
//     reader.onload = async (evt) => {
//       const arrayBuffer = evt.target.result;
//       const workbook = XLSX.read(arrayBuffer, { type: 'array' });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  
//       // Enrich rows with bookingId, remarks, saved (default values)
//       const enrichedData = await Promise.all(jsonData.map(async (row) => {
//         let saved = false;
//         let existingBookingId = '';
//         let existingRemarks = '';
  
//         // 🔍 Lookup Firestore for matching saved payment
//         try {
//           for (const bookingId of bookingIds) {
//             const paymentsRef = collection(db, "invoices", bookingId, "payments");
//             const paymentsSnap = await getDocs(paymentsRef);
//             paymentsSnap.forEach(doc => {
//               const payment = doc.data();
//               if (payment.Date === row.Date && payment.Balance === row.Balance) { // 📝 match criteria can be improved
//                 saved = true;
//                 existingBookingId = bookingId;
//                 existingRemarks = payment.remarks || '';
//               }
//             });
//           }
//         } catch (err) {
//           console.error("Error checking existing payments:", err);
//         }
  
//         return {
//           ...row,
//           bookingId: existingBookingId,
//           remarks: existingRemarks,
//           saved
//         };
//       }));
  
//       console.log('Parsed & enriched Data:', enrichedData);
//       setData(enrichedData);
//     };
  
//     reader.readAsArrayBuffer(file);
//   };
  
//   const handleBookingChange = (value, index) => {
//     const updatedData = [...data];
//     updatedData[index].bookingId = value;
//     setData(updatedData);
//   };

//   const handleRemarksChange = (value, index) => {
//     const updatedData = [...data];
//     updatedData[index].remarks = value;
//     setData(updatedData);
//   };

//   const handleSave = async (index) => {
//     const row = data[index];
//     if (!row.bookingId) {
//       alert("Please select a Booking ID before saving.");
//       return;
//     }
//     const bookingId = row.bookingId.toString();

//     try {
//       const paymentDocRef = doc(db, "invoices", bookingId, "payments", `${new Date()}`);
//       await setDoc(paymentDocRef, {
//         ...row,
//         timestamp: new Date(),
//       });
//       alert(`Payment saved under booking ID ${row.bookingId}`);

//       const updatedData = [...data];
//       updatedData[index] = { ...row, saved: true };
//       setData(updatedData);
//     } catch (error) {
//       console.error("Error saving payment:", error);
//       alert("Error saving payment. Check console for details.");
//     }
//   };

//   return (
//     // <div style={{ padding: '20px' }}>
//     //   <h2>Bank Statement Upload</h2>
//     //   <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

//     //   {/* {loading && <p>Loading Booking IDs...</p>} */}

//     //   {data.length > 0 && (
//     //     <table border="1" cellPadding="5" style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
//     //       <thead>
//     //         <tr>
//     //           {Object.keys(data[0]).filter(key => key !== 'saved').map((key) => (
//     //             <th key={key}>{key}</th>
//     //           ))}
//     //           <th>Action</th>
//     //         </tr>
//     //       </thead>
//     //       <tbody>
//     //         {data.map((row, index) => (
//     //           <tr key={index}>
//     //             {Object.keys(row).filter(key => key !== 'saved').map((key, idx) => (
//     //               <td key={idx}>
//     //                 {key === 'bookingId' ? (
//     //                   <Autocomplete
//     //                     value={row.bookingId}
//     //                     onChange={(event, newValue) => handleBookingChange(newValue, index)}
//     //                     options={bookingIds}
//     //                     renderInput={(params) => <TextField {...params} label="Booking ID" />}
//     //                     getOptionLabel={(option) => option?.toString() ?? ''}
//     //                     freeSolo
//     //                     disabled={row.saved}
//     //                   />
//     //                 ) : key === 'remarks' ? (
//     //                   <TextField
//     //                     value={row.remarks}
//     //                     onChange={(e) => handleRemarksChange(e.target.value, index)}
//     //                     placeholder="Remarks"
//     //                     size="small"
//     //                     disabled={row.saved}
//     //                   />
//     //                 ) : (
//     //                   row[key]
//     //                 )}
//     //               </td>
//     //             ))}
//     //             <td>
//     //               {row.saved ? (
//     //                 <span style={{ color: 'green', fontWeight: 'bold' }}>Saved</span>
//     //               ) : (
//     //                 <Button variant="contained" color="primary" onClick={() => handleSave(index)}>
//     //                   Save
//     //                 </Button>
//     //               )}
//     //             </td>
//     //           </tr>
//     //         ))}
//     //       </tbody>
//     //     </table>
//     //   )}
//     // </div>
//     <div style={{ padding: '20px' ,backgroundColor:'white',width:'75vw'}}>
//   <h2>Bank Statement Upload</h2>
//   <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

//   {data.length > 0 && (
//     <div style={{ overflowX: 'auto', marginTop: '20px' }}>
//       <table
//         style={{
//           borderCollapse: 'collapse',
//           width: '100%',
//           minWidth: '1000px', // force horizontal scroll if content wider
//         }}
//       >
//         <thead>
//           <tr>
//             {Object.keys(data[0])
//               .filter((key) => key !== 'saved')
//               .map((key) => (
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
//                   {key}
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
//           {data.map((row, index) => (
//             <tr key={index}>
//               {Object.keys(row)
//                 .filter((key) => key !== 'saved')
//                 .map((key, idx) => (
//                   <td
//                     key={idx}
//                     style={{
//                       border: '1px solid #ddd',
//                       padding: '8px',
//                       verticalAlign: 'top',
//                       whiteSpace: 'nowrap', // ❗️ keeps content in one line
//                       overflow: 'hidden',
//                       textOverflow: 'ellipsis',
//                       maxWidth: '200px', // optional: clip long content
//                     }}
//                   >
//                     {key === 'bookingId' ? (
//                       <Autocomplete
//                         value={row.bookingId}
//                         onChange={(event, newValue) =>
//                           handleBookingChange(newValue, index)
//                         }
//                         options={bookingIds}
//                         renderInput={(params) => (
//                           <TextField {...params} label="Booking ID" />
//                         )}
//                         getOptionLabel={(option) =>
//                           option?.toString() ?? ''
//                         }
//                         freeSolo
//                         disabled={row.saved}
//                       />
//                     ) : key === 'remarks' ? (
//                       <TextField
//                         value={row.remarks}
//                         onChange={(e) =>
//                           handleRemarksChange(e.target.value, index)
//                         }
//                         placeholder="Remarks"
//                         size="small"
//                         disabled={row.saved}
//                       />
//                     ) : (
//                       row[key]
//                     )}
//                   </td>
//                 ))}
//               <td
//                 style={{
//                   border: '1px solid #ddd',
//                   padding: '8px',
//                   textAlign: 'center',
//                   whiteSpace: 'nowrap',
//                 }}
//               >
//                 {row.saved ? (
//                   <span style={{ color: 'green', fontWeight: 'bold' }}>
//                     Saved
//                   </span>
//                 ) : (
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => handleSave(index)}
//                   >
//                     Save
//                   </Button>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )}
// </div>

//   );
// };

// export default PaymentRecon;

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Autocomplete, TextField, Button } from '@mui/material';
import { db } from '../Firebase/firebase';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const PaymentRecon = () => {
  const [data, setData] = useState([]);
  const [bookingIds, setBookingIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileName,setFileName]=useState(null);

  // Fetch booking IDs from Firestore
  const fetchBookingIds = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "invoices"));
      const ids = querySnapshot.docs.map(doc => doc.data().bookingId);
      setBookingIds(ids);
    } catch (error) {
      console.error("Error fetching Booking IDs:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookingIds();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    
    setFileName(file);
    const reader = new FileReader();
  
    reader.onload = async (evt) => {
      const arrayBuffer = evt.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  
      // Enrich rows with bookingId, remarks, saved (default values)
      const enrichedData = await Promise.all(jsonData.map(async (row) => {
        let saved = false;
        let existingBookingId = '';
        let existingRemarks = '';
  
        // 🔍 Lookup Firestore for matching saved payment
        try {
          for (const bookingId of bookingIds) {
            const paymentsRef = collection(db, "invoices", bookingId, "payments");
            const paymentsSnap = await getDocs(paymentsRef);
            paymentsSnap.forEach(doc => {
              const payment = doc.data();
              if (payment.Date === row.Date && payment.Balance === row.Balance) { // 📝 match criteria can be improved
                saved = true;
                existingBookingId = bookingId;
                existingRemarks = payment.remarks || '';
              }
            });
          }
        } catch (err) {
          console.error("Error checking existing payments:", err);
        }
  
        return {
          ...row,
          bookingId: existingBookingId,
          remarks: existingRemarks,
          saved
        };
      }));
  
      console.log('Parsed & enriched Data:', enrichedData);
      setData(enrichedData);
    };
  
    reader.readAsArrayBuffer(file);
  };
  
  const handleBookingChange = (value, index) => {
    const updatedData = [...data];
    updatedData[index].bookingId = value;
    setData(updatedData);
  };

  // Handle save action when button clicked
  const handleSave = async (index) => {
    const row = data[index];
    if (!row.bookingId) {
      alert("Please select a Booking ID before saving.");
      return;
    }
    const bookingId = row.bookingId.toString();

    // Fetch current remarks value from input field
    const remarks = document.getElementById(`remarks-${index}`).value;

    try {
      const paymentDocRef = doc(db, "invoices", bookingId, "payments", `${new Date()}`);
      await setDoc(paymentDocRef, {
        ...row,
        remarks: remarks,
        timestamp: new Date(),
      });

      alert(`Payment saved under booking ID ${row.bookingId}`);

      const updatedData = [...data];
      updatedData[index] = { ...row, saved: true };
      setData(updatedData);
    } catch (error) {
      console.error("Error saving payment:", error);
      alert("Error saving payment. Check console for details.");
    }
  };

  return (
    <div style={{ padding: '20px' ,backgroundColor:'white',width:'75vw',borderRadius:'10px'}}>
      <span className='font-semibold text-3xl h-18 flex justify-start items-start'>Payment Reconciliation</span>
      {/* <h2 className='font-semibold text-xl'>Upload Bank Statement</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} /> */}
          <div className="w-full">
      <h2 className="font-semibold text-xl mb-4 ">Upload Bank Statement</h2>

      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl w-full h-48 cursor-pointer hover:border-[#005899] hover:bg-gray-50 transition"
      >
        <UploadFileIcon className="text-black" style={{ fontSize: '60px' }} />
         <p className="mt-2 text-base">
        Selected file: {fileName ? fileName.name : 'No file selected'}
      </p>
        
        <input
          id="file-upload"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

     
    </div>

      {data.length > 0 && (
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table
            style={{
              borderCollapse: 'collapse',
              width: '100%',
              minWidth: '1000px', // force horizontal scroll if content wider
            }}
          >
            <thead>
              <tr>
                {Object.keys(data[0])
                  .filter((key) => key !== 'saved')
                  .map((key) => (
                    <th
                      key={key}
                      style={{
                        border: '1px solid #ccc',
                        padding: '8px',
                        background: '#f4f4f4',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {key}
                    </th>
                  ))}
                <th
                  style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    background: '#f4f4f4',
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {Object.keys(row)
                    .filter((key) => key !== 'saved')
                    .map((key, idx) => (
                      <td
                        key={idx}
                        style={{
                          border: '1px solid #ddd',
                          padding: '8px',
                          verticalAlign: 'top',
                          whiteSpace: 'nowrap', // ❗️ keeps content in one line
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '200px', // optional: clip long content
                        }}
                      >
                        {key === 'bookingId' ? (
                          <Autocomplete
                            value={row.bookingId}
                            onChange={(event, newValue) =>
                              handleBookingChange(newValue, index)
                            }
                            options={bookingIds}
                            renderInput={(params) => (
                              <TextField {...params} label="Booking ID" />
                            )}
                            getOptionLabel={(option) =>
                              option?.toString() ?? ''
                            }
                            freeSolo
                            disabled={row.saved}
                          />
                        ) : key === 'remarks' ? (
                          <TextField
                            id={`remarks-${index}`} // unique ID for each input
                            defaultValue={row.remarks}
                            placeholder="Remarks"
                            size="medium"
                            disabled={row.saved}
                            
                            
                          />
                        ) : (
                          row[key]
                        )}
                      </td>
                    ))}
                  <td
                    style={{
                      border: '1px solid #ddd',
                      padding: '8px',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.saved ? (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>
                        Saved
                      </span>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSave(index)}
                      >
                        Save
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentRecon;
