import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { db } from "../Firebase/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import { Link } from "react-router-dom";
import GlobalTextFieldHoverStyle from "./GlobalTextFieldHoverStyle";
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from "@mui/material";
import InvoiceForm from "./SalesForm";



const RECORDS_PER_PAGE = 10;
  // Default fields for each item type
  const TYPE_DEFAULT_FIELDS = {
    Flight: [
      'code',
      'boardingDate',
      'departureCountry',
      'departureState',
      'departureLocation',
      'arrivalCountry',
      'arrivalState',
      'arrivalLocation',
    ],
    Taxi: [
      'code',
      'pickupDate',
      'pickupCountry',
      'pickupState',
      'pickupLocation',
      'dropoffCountry',
      'dropoffState',
      'dropoffLocation',
      'vehicleType',
    ],
    Hotel: [
      'code',
      'checkInDate',
      'checkOutDate',
      'hotelCountry',
      'hotelState',
      'hotelLocation',
      'hotelName',
      'roomType',
    ],
    Guide: [
      'code',
      'guideDate',
      'duration',
      'language',
      'guideCountry',
      'guideState',
      'guideLocation',
      'guideGender',
    ],
    Visa: [
      'code',
  'visaApplicationDate',  // Date of application
  'visaType', // e.g. Tourist, Business, Transit
  'passportNumber',       // Linked document
  'countryOfIssue',       // Visa-issuing country
  'visacountry',
  'durationOfStay',       // e.g. "30 days"
  'entryType',// Single-entry / Multiple-entry
],

  };

export function BookingInvoices() {
  const queryClient = useQueryClient();

 

  
   

  
  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const bookingsCollection = collection(db, "bookings");
      const snapshot = await getDocs(bookingsCollection);
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });

  const addBooking= async (booking) => {
    const bookingsCollection = collection(db, "bookings");
    await addDoc(bookingsCollection, booking);
  };

  const mutate = useMutation({
    mutationFn: addBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings']);
    },
    onError: (error) => {
      console.error("Error adding Booking", error);
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

   const [isEditing, setIsEditing] = useState(false);
  
// new state
const [invoiceData, setInvoiceData] = useState(null);
const [advisoryData, setAdvisoryData] = useState(null);
const [advisoryRows, setAdvisoryRows] = useState([]);
const [modalLoading, setModalLoading] = useState(false);

const [bankStatements, setBankStatements] = useState([]);


  useEffect(() => {
    async function fetchStatements() {
      const rows = [];

      for (const advisory of advisoryData) {
        const row = {
          paymentAdvisoryId: advisory.paymentAdvisoryId,
          refId: advisory.refId,
          vendorGSTIN: '',
          totalPaid: '',
          paymentDate: '',
          remarks: '',
          noStatement: false,
        };

        if (advisory.refId) {
          const bankRef = doc(db, 'bankstatement', advisory.refId);
          const snap = await getDoc(bankRef);
          if (snap.exists()) {
            const data = snap.data();
            row.ref=data['Cheque/Ref No.']
            row.vendorGSTIN = data.vendorGSTIN;
            row.desc=data['Transaction Description']
            row.totalPaid = data['Withdrawals (Dr)'];
            row.Date = data.Date;
            row.remarks = data.remarks || '';
          } else {
            row.noStatement = true;
          }
        } else {
          row.noStatement = true;
        }

        rows.push(row);
      }

      setBankStatements(rows);
    }

    if (advisoryData?.length) fetchStatements();
  }, [advisoryData]);


// Snackbar state
const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
const showSnackbar = (message, severity = "info") => {
  setSnackbar({ open: true, message, severity });
};

// Confirmation dialog state
const [confirmOpen, setConfirmOpen] = useState(false);
const [onConfirm, setOnConfirm] = useState(() => () => {});

//Tabs in modal
const TAB_KEYS = {
  BOOKING: "booking",
  INVOICE: "invoice",
  ADVISORY: "advisory",
};

const hasInvoiceData = invoiceData && invoiceData.length > 0;
const hasAdvisoryData = advisoryData && advisoryData.length > 0;

const tabs = [
  { key: TAB_KEYS.BOOKING, label: "Booking Details", disabled: false },
  { key: TAB_KEYS.INVOICE, label: "Invoice Booking Details", disabled: !hasInvoiceData },
  { key: TAB_KEYS.ADVISORY, label: "Payment Advisory", disabled: !hasAdvisoryData },
];

const [activeTab, setActiveTab] = useState(TAB_KEYS.BOOKING);


  // const filteredBookings = data.filter(
  //   (booking) =>
  //     booking.code?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     booking.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const filteredBookings = data.filter(
  (booking) =>
    booking.bookingId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customerdtls?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customerdtls?.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
);


  const totalPages = Math.ceil(filteredBookings.length / RECORDS_PER_PAGE);
  const currentRecords = filteredBookings.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE
  );

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        jsonData.forEach((row) => {
          const booking = {
code: row["code"] || "",
name: row["name"] || "",
address: row["address"] || "",
city: row["city"] || "",
pincode: row["pincode"] || "",
email: row["email"] || "",
phone: row["phone"] || "",
pan: row["pan"] || "",
tan: row["tan"] || "",
gstin: row["gstin"] || "",
turnover: row["turnover"] || "",
tds: row["tds"] || "",
tcs: row["tcs"] || "",
status: row["status"] || "Pending",
          };
          mutate.mutate(booking);
        });
      } catch (error) {
        console.error("Import failed:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "bookings");
    XLSX.writeFile(wb, "bookings_onboarding.xlsx");
  };

  
// call this when view button is clicked
// const handleViewClick = async (booking) => {
//   setSelectedBooking(booking);
//   setModalOpen(true);
//   setInvoiceData(null);
//   setAdvisoryData(null);
//   setAdvisoryRows([]);
//   setModalLoading(true);

//   try {
//     const vendorGSTIN = "07DXJPS4906L1ZU";
//     const invoiceId = booking.invoiceBookingids?.[0];

//     if (!vendorGSTIN || !invoiceId) return;

//     // 1. Fetch invoice data
//     const invoiceRef = doc(db, `invoiceBooking/${vendorGSTIN}/${invoiceId}/01`);
//     const invoiceSnap = await getDoc(invoiceRef);
//     const invoice = invoiceSnap.exists() ? invoiceSnap.data() : null;
//     setInvoiceData(invoice);

//     // 2. Fetch advisory data
//     const paymentAdvisoryId = invoice?.paymentAdvisoryIds?.[0];
//     if (paymentAdvisoryId) {
//       const advisoryRef = doc(
//         db,
//         `paymentAdvisory/${vendorGSTIN}/${paymentAdvisoryId}/01`
//       );
//       const advisorySnap = await getDoc(advisoryRef);
//       const advisory = advisorySnap.exists() ? advisorySnap.data() : null;
//       setAdvisoryData(advisory);

//       const matchingRows = advisory?.items?.filter(
//         (row) => row.bookingId === booking.id
//       );
//       setAdvisoryRows(matchingRows || []);
//     }
//   } catch (err) {
//     console.error("Failed to load modal data:", err);
//   } finally {
//     setModalLoading(false);
//   }
// };

// const handleViewClick = async (booking) => {
//   setSelectedBooking(booking);
//   setModalOpen(true);
//   setInvoiceData(null);
//   setAdvisoryData(null);
//   setAdvisoryRows([]);
//   setModalLoading(true);

//   try {
//     const vendorGSTIN = "07DXJPS4906L1ZU";
//     if (!vendorGSTIN) {
//       setModalLoading(false);
//       return;
//     }

//     const allInvoiceData = [];
//     const allAdvisoryData = [];
//     const allAdvisoryRows = [];

//     // Loop through all invoiceBookingIds (if any)
//     for (const invoiceId of booking.invoiceBookingids || []) {
//       const invoiceRef = doc(db, `invoiceBooking/${vendorGSTIN}/${invoiceId}/01`);
//       const invoiceSnap = await getDoc(invoiceRef);
//       if (invoiceSnap.exists()) {
//         const invoice = invoiceSnap.data();
//         invoice.invoiceId = invoiceId; // keep track of id
//         allInvoiceData.push(invoice);

//         // Loop through all payment advisory ids for this invoice
//         for (const paymentAdvisoryId of invoice.paymentAdvisoryIds || []) {
//           const advisoryRef = doc(db, `paymentAdvisory/${vendorGSTIN}/${paymentAdvisoryId}/01`);
//           const advisorySnap = await getDoc(advisoryRef);
//           if (advisorySnap.exists()) {
// const advisory = advisorySnap.data();
// advisory.paymentAdvisoryId = paymentAdvisoryId;
// allAdvisoryData.push(advisory);

// // Filter advisory items by booking id and add to allAdvisoryRows
// const matchingRows = advisory.items?.filter(row => row.bookingId === booking.id) || [];
// allAdvisoryRows.push(...matchingRows);
//           }
//         }
//       }
//     }

//     setInvoiceData(allInvoiceData);
//     setAdvisoryData(allAdvisoryData);
//     setAdvisoryRows(allAdvisoryRows);
//   } catch (err) {
//     console.error("Failed to load modal data:", err);
//   } finally {
//     setModalLoading(false);
//   }
// };


const handleViewClick = async (booking) => {
  setSelectedBooking(booking);
  setModalOpen(true);
  setInvoiceData(null);
  setAdvisoryData(null);
  setAdvisoryRows([]);
  setModalLoading(true);

  try {
    const vendorGSTIN = "07DXJPS4906L1ZU";
    if (!vendorGSTIN) {
      setModalLoading(false);
      return;
    }

    const allInvoiceData = [];
    const allAdvisoryData = [];
    const allAdvisoryRows = [];

    for (const invoiceId of booking.invoiceBookingids || []) {
      // 🔁 Dynamically fetch all docs under invoiceId
      const invoiceCollectionRef = collection(db, `invoiceBooking/${vendorGSTIN}/${invoiceId}`);
      const invoiceDocsSnap = await getDocs(invoiceCollectionRef);

      for (const invoiceDoc of invoiceDocsSnap.docs) {
        const invoice = invoiceDoc.data();
        invoice.invoiceId = invoiceId;
        invoice.docId = invoiceDoc.id;
        allInvoiceData.push(invoice);

        for (const paymentAdvisoryId of invoice.paymentAdvisoryIds || []) {
          // 🔁 Dynamically fetch all docs under paymentAdvisoryId
          const advisoryCollectionRef = collection(db, `paymentAdvisory/${vendorGSTIN}/${paymentAdvisoryId}`);
          const advisoryDocsSnap = await getDocs(advisoryCollectionRef);

          for (const advisoryDoc of advisoryDocsSnap.docs) {
            const advisory = advisoryDoc.data();
            advisory.paymentAdvisoryId = paymentAdvisoryId;
            advisory.docId = advisoryDoc.id;
            allAdvisoryData.push(advisory);

            const matchingRows = advisory.items?.filter(row => row.bookingId === booking.id) || [];
            allAdvisoryRows.push(...matchingRows);
          }
        }
      }
    }

    setInvoiceData(allInvoiceData);
    setAdvisoryData(allAdvisoryData);
    setAdvisoryRows(allAdvisoryRows);
  } catch (err) {
    console.error("Failed to load modal data:", err);
  } finally {
    setModalLoading(false);
  }
};


  return (
    <div className="      space-y-6 bg-white shadow rounded-lg w-[75vw] h-auto flex flex-col justify-center items-center gap-4 " style={{padding:'12px'}}>
       <GlobalTextFieldHoverStyle/>
        <div className="w-[95%] flex justify-between items-center" style={{padding:'4px'}}><h1 className="text-3xl text-black font-bold">Booking Invoices</h1>
        <Link to={"/sales"} className="text-sm bg-black text-white rounded-lg" style={{padding:'4px'}} ><NoteAddIcon/> &nbsp;Create New Booking</Link>
        </div>
      <div className="flex justify-between items-center    w-[95%]">
        <div className="flex flex-col w-1/3 ">
 <div className="relative w-full">
      <span className="absolute inset-y-0 left-0  flex items-center pointer-events-none text-gray-500">
        <SearchIcon fontSize="small" />
      </span>
      <input
    
        type="text"
        id="search"
        className="border  rounded-lg w-[90%] h-8 hover:border-[#005899] focus:outline-none"
        placeholder="Search Bookings..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        style={{padding:'2px 0 2px 20px'}}
      />
    </div>
    
    
</div>
        <div className="flex   gap-2 text-sm">
          <label className="border rounded-lg cursor-pointer bg-black text-white flex items-center" style={{padding:'6px'}}>
<UploadOutlinedIcon/>Import
<input
  type="file"
  accept=".xlsx, .xls"
  className="hidden"
  onChange={handleFileUpload}
/>
          </label>
          <button
className="border rounded-lg bg-black text-white "
onClick={handleExport}
style={{padding:'6px'}}
          >
           <DownloadOutlinedIcon/> Export
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading records...</p>
      ) : isError ? (
        <p className="text-red-500">Error loading records.</p>
      ) : currentRecords.length > 0 ? (
        <>
        <div className="table-container border border-black w-[95%] flex justify-center items-center rounded-lg" >
          <table className="rounded-lg overflow-hidden w-[100%] text-sm border border-black">
  <thead className="bg-[#e6f0f7]">
    <tr className="h-8">
      <th className="text-left text-sm font-semibold text-gray-600" style={{ padding: '4px' }}>Booking ID</th>
      <th className="text-left text-sm font-semibold text-gray-600" style={{ padding: '4px' }}>Customer Name</th>
      <th className="text-left text-sm font-semibold text-gray-600" style={{ padding: '4px' }}>Booking Type</th>
      <th className="text-left text-sm font-semibold text-gray-600" style={{ padding: '4px' }}>Duration</th>
      {/* <th className="text-left text-sm font-semibold text-gray-600" style={{ padding: '4px' }}>Created At</th> */}
      <th className="text-left text-sm font-semibold text-gray-600" style={{ padding: '4px' }}>To Pay</th>
      <th className="text-right text-sm font-semibold text-gray-600" style={{ padding: '4px' }}>Actions</th>
    </tr>
  </thead>
  <tbody>
    {currentRecords.map((booking) => (
      <tr key={booking.bookingId} className="border border-black hover:bg-gray-50 h-8">
        <td style={{ padding: '4px' }}>{booking.bookingId}</td>
        <td style={{ padding: '4px' }}>{booking.customerdtls?.name}</td>
        <td style={{ padding: '4px' }}>{booking.bookingType}</td>
        <td style={{ padding: '4px' }}>
          {booking.startdate} to {booking.enddate}
        </td>
        {/* <td style={{ padding: '4px' }}>{booking.createdAt}</td> */}
        <td style={{ padding: '4px' }}>{booking.toPay}</td>
        <td className="text-right" style={{ padding: '4px' }}>
          <button
className="border   rounded-md text-[#005899] border-white hover:border-[#005899] bg-white"
onClick={() => handleViewClick(booking)}
style={{ padding: '4px' }}
          >
<VisibilityOutlinedIcon/>
          </button>
           <button
      className="border rounded-md text-[#005899] border-white hover:border-[#005899] bg-white"
      onClick={() => {
        setSelectedBooking(booking);  // Make sure this sets the booking to edit
        setIsEditing(true);           // This opens the edit modal
        setModalOpen(true);           // If you use a separate modal open flag
      }}
      style={{ padding: '4px' }}
    >
      <EditOutlinedIcon />
    </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

          </div>

          <div className="flex justify-end items-center gap-2    ">
           <button
className="w-8 h-8 border text-white bg-black rounded-md disabled:opacity-50 flex justify-center items-center"
 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
 disabled={currentPage === 1}
 
           >
 <ArrowLeftIcon fontSize="large"/>
           </button>
<span className="text-gray-700">
  Page {currentPage} of {totalPages}
</span>
<button
 className="w-8 h-8 border text-white bg-black rounded-md disabled:opacity-50 flex justify-center items-center"
  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
  disabled={currentPage === totalPages}
  
>
  <ArrowRightIcon fontSize="large"/>
</button>
          </div>
        </>
      ) : (
        <p>No records found.</p>
      )}

      {/* Add booking Form*/ }
      

      {/* Modal */}
     <div style={{display:'none'}}>
      {modalOpen && selectedBooking && (
  <div className="fixed inset-0 flex items-center justify-center z-50" style={{
    backgroundColor: "rgba(0, 0,0, 0.4)", // change alpha for more/less dim
    
  }}>
    <div className="bg-white       rounded-lg shadow max-w-4xl w-full relative overflow-auto h-[90vh] " style={{padding:'10px'}}>
      <h2 className="text-lg font-bold ">Booking Details</h2>

      {modalLoading ? (
        <p className="text-sm">Loading booking information...</p>
      ) : (
        <>
         
         
          <div className=" text-sm">
<h3 className="font-semibold text-md  ">Booking Summary</h3>
<div className="bg-gray-100 p-3 rounded">
  <p><strong>ID:</strong> {selectedBooking.bookingId}</p>
  <p><strong>Package:</strong> {selectedBooking.pkgName}</p>
  <p><strong>Type:</strong> {selectedBooking.bookingType}</p>
  <p><strong>Amount:</strong> ₹{selectedBooking.pkgPrice}</p>
  <p><strong>Dates:</strong> {selectedBooking.startdate} - {selectedBooking.enddate}</p>
</div>
           
{selectedBooking?.items?.length > 0 && (
  <div className="   ">
    <h2 className="text-xl font-bold  ">Booking Items</h2>

    {(() => {
      const groupedItems = {};

      selectedBooking.items.forEach((item) => {
        const itemType = item.itemId;
        if (!groupedItems[itemType]) groupedItems[itemType] = [];

        item.rows?.forEach((row) => {
          groupedItems[itemType].push(row);
        });
      });

      return Object.entries(groupedItems).map(([itemType, rows]) => (
        <div key={itemType} className="     ">
          <h3 className="text-lg font-semibold  ">{itemType}</h3>
          <div className="overflow-x-auto border rounded">
<table className="w-full border border-gray-300 text-sm">
  <thead className="bg-gray-100">
    <tr>
      {TYPE_DEFAULT_FIELDS[itemType]?.map((field) => (
        <th key={field} className="border capitalize whitespace-nowrap">
          {field}
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    {rows.map((row, i) => (
      <tr key={i} className="even:bg-gray-50">
        {TYPE_DEFAULT_FIELDS[itemType]?.map((field) => (
          <td key={field} className="border whitespace-nowrap">
{row[field] !== undefined && row[field] !== ''
  ? row[field].toString()
  : '-'}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
          </div>
        </div>
      ));
    })()}
  </div>
)}


          </div>

          {/* Invoice Info */}
          {/* {invoiceData && (
<div className="   text-sm">
  <h3 className="font-semibold text-md  ">Invoice</h3>
  <div className="bg-gray-100 p-3 rounded  ">
    <p><strong>Invoice #:</strong> {invoiceData.invoiceNumber}</p>
    <p><strong>Date:</strong> {invoiceData.invoiceDate}</p>
    <p><strong>Value:</strong> ₹{invoiceData.invoiceValue}</p>
  </div>
  <table className="w-full text-sm border   ">
    <thead>
      <tr className="bg-gray-200">
        <th className="border">Item</th>
        <th className="border">Code</th>
        <th className="border">Taxable</th>
        <th className="border">GST%</th>
        <th className="border">Debit</th>
      </tr>
    </thead>
    <tbody>
      {invoiceData.rows?.filter(row => row.bookingId === selectedBooking.id).map((row, i) => (
        <tr key={i}>
          <td className="border">{row.item}</td>
          <td className="border">{row.itemCode}</td>
          <td className="border">₹{row.taxableValue}</td>
          <td className="border">{row.gstRate}%</td>
          <td className="border">₹{row.debitAmount}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
          )} */}

          {/* Payment Advisory Info */}
          {/* {advisoryData && (
<div className="   text-sm">
  <h3 className="font-semibold text-md  ">Payment Advisory</h3>
  <div className="bg-gray-100 p-3 rounded  ">
    <p><strong>Advisory ID:</strong> {advisoryData.paymentAdvisoryId}</p>
    <p><strong>Date:</strong> {advisoryData.paymentDate}</p>
    <p><strong>Total Debit:</strong> ₹{advisoryData.totalDebitAmount}</p>
  </div>
  <table className="w-full text-sm border">
    <thead>
      <tr className="bg-gray-200">
        <th className="border">Item</th>
        <th className="border">Code</th>
        <th className="border">Taxable</th>
        <th className="border">CGST</th>
        <th className="border">SGST</th>
        <th className="border">Total</th>
      </tr>
    </thead>
    <tbody>
      {advisoryRows.map((row, i) => (
        <tr key={i}>
          <td className="border">{row.item}</td>
          <td className="border">{row.itemCode}</td>
          <td className="border">₹{row.taxableValue}</td>
          <td className="border">₹{row.cgst}</td>
          <td className="border">₹{row.sgst}</td>
          <td className="border">₹{row.debitAmount}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
          )} */}
          
{invoiceData && invoiceData.length > 0 && (
  <div className="   text-sm">
    <h3 className="font-semibold text-md  ">Invoices</h3>
    {invoiceData.map((invoice, idx) => (
      <div key={invoice.invoiceId || idx} className="  ">
        <div className="bg-gray-100 p-3 rounded  ">
          
          
        </div>
      </div>
    ))}
    <div className="  ">
  <h3 className="text-lg font-semibold  ">Bookings Covered in Invoices</h3>
  <ul className="list-disc       text-sm text-gray-700">
    {invoiceData.map((invoice, index) => {
      const uniqueBookingIds = Array.from(
        new Set((invoice.rows || []).map(row => row.bookingId))
      ).filter(Boolean); // Remove undefined/null
      return (
        <li key={index}>
          <span className="font-medium">{invoice.invoiceId || `Invoice ${index + 1}`}</span>:&nbsp;
          {uniqueBookingIds.length > 0 ? uniqueBookingIds.join(', ') : '-'}
        </li>
      );
    })}
  </ul>
</div>


    <table className="w-full text-sm border   ">
      <thead>
        <tr className="bg-gray-200">
          <th className="border">Invoice ID</th>
          <th className="border">Invoice Number</th>
          <th className="border">Invoice Date</th>
    <th className="border">Received Date</th>
    <th className="border">Due Date</th>
          <th className="border">Item</th>
          <th className="border">Code</th>
          <th className="border">Taxable</th>
          <th className="border">GST%</th>
          <th className="border">Amount</th>
        </tr>
      </thead>
      <tbody>
        {invoiceData.flatMap(invoice =>
          (invoice.rows || [])
.filter(row => row.bookingId === selectedBooking.id)
.map((row, i) => (
  <tr key={`${invoice.invoiceId}-${i}`}>
    <td className="border">{invoice.invoiceId}</td>
     <td className="border">{invoice.invoiceNumber || '-'}</td>
      <td className="border">{invoice.invoiceDate || '-'}</td>
      <td className="border">{invoice.invoiceReceiveDate || '-'}</td>
      <td className="border">{invoice.dueDate || '-'}</td>
    <td className="border">{row.item}</td>
    <td className="border">{row.itemCode}</td>
    <td className="border">₹{row.taxableValue}</td>
    <td className="border">{row.gstRate}%</td>
    <td className="border">₹{row.debitAmount}</td>
  </tr>
))
        )}
      </tbody>
      <tfoot>
  <tr>
    <td colSpan={9} className="text-right font-semibold border">
      Total Amount 
    </td>
    <td className="font-semibold border">
      ₹{
        invoiceData
          .flatMap(invoice =>
(invoice.rows || []).filter(row => row.bookingId === selectedBooking.id)
          )
          .reduce((sum, row) => sum + (parseFloat(row.debitAmount) || 0), 0)
          .toFixed(2)
      }
    </td>
  </tr>
</tfoot>


    </table>
  </div>
)}

{/* Payment Advisory Info
{advisoryData && advisoryData.length > 0 && (
  <div className="   text-sm">
    <h3 className="font-semibold text-md  ">Payment Advisories</h3>
    {advisoryData.map((advisory, idx) => (
      <div key={advisory.paymentAdvisoryId || idx} className="bg-gray-100 p-3 rounded  ">
        <p><strong>Advisory ID:</strong> {advisory.paymentAdvisoryId}</p>
        <p><strong>Date:</strong> {advisory.paymentDate}</p>
        <p><strong>Total Debit:</strong> ₹{advisory.totalDebitAmount}</p>
      </div>
    ))}

    <table className="w-full text-sm border">
      <thead>
        <tr className="bg-gray-200">
          <th className="border">Item</th>
          <th className="border">Code</th>
          <th className="border">Taxable</th>
          <th className="border">CGST</th>
          <th className="border">SGST</th>
          <th className="border">Total</th>
        </tr>
      </thead>
      <tbody>
        {advisoryRows.map((row, i) => (
          <tr key={i}>
<td className="border">{row.item}</td>
<td className="border">{row.itemCode}</td>
<td className="border">₹{row.taxableValue}</td>
<td className="border">₹{row.cgst}</td>
<td className="border">₹{row.sgst}</td>
<td className="border">₹{row.debitAmount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)} */}
{advisoryData && advisoryData.length > 0 && (
  <div className="   text-sm">
    <h3 className="font-semibold text-md  ">Payment Advisories</h3>

    <table className="w-full text-sm border">
      <thead>
        <tr className="bg-gray-200">
          <th className="border">Payment Advisory ID</th>
          <th className="border">Advisory Date</th>
          <th className="border">Invoice Booking ID</th>
          <th className="border">Total Bill </th>
          <th className="border">Paid</th>
          <th className="border">Remaining</th>
          <th className="border">Status</th>
        </tr>
      </thead>
      <tbody>
        {advisoryData.map((advisory, idx) => (
          <tr key={advisory.paymentAdvisoryId || idx}>
<td className="border">{advisory.paymentAdvisoryId}</td>
<td className="border">{advisory.paymentDate || '-'}</td>
<td className="border">{advisory.invoiceAdvisoryId || '-'}</td>
<td className="border">₹{advisory.totalDebitAmount || '0'}</td>
<td className="border">₹{advisory.allocatedAmount || '0'}</td>
<td className="border">₹{((advisory.totalDebitAmount || 0) - (advisory.allocatedAmount || 0)).toFixed(2)}</td>
<td className="border">
  {(advisory.totalDebitAmount || 0) - (advisory.allocatedAmount || 0) <= 0
    ? 'Paid'
    : 'Pending'}
</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}



        </>
      )}

      <button
        className="    border rounded-lg bg-white hover:bg-gray-100"
        onClick={() => setModalOpen(false)}
      >
        Close
      </button>
    </div>
  </div>
)}
</div>


<div style={{display:'none'}}>
{modalOpen && selectedBooking && (
  <div
    className="fixed inset-0 flex items-center justify-center z-50"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
  >
  <div className=" rounded-lg shadow-xl min-w-[70vw] relative " >

    
       <div className="flex justify-between items-center  h-16 bg-[#0b80d3] rounded-t-lg" style={{padding:'10px'}}>
        <span className="flex gap-4 items-center">
              <h2 className="text-2xl text-white font-bold flex-grow">
          {isEditing ? "Edit Booking Details" : "Booking Details"}
        </h2>
          {!isEditing && (
                <button
                  className="border  rounded-md text-[#005899] border-white hover:border-[#005899] bg-white    "
                  onClick={() => setIsEditing(true)}
                  style={{padding:'4px'}}
                >
                  <EditOutlinedIcon/>
                </button>
                
              )}
              {isEditing && (
<button
  className="border  rounded-md text-[#005899] border-white hover:border-[#005899] bg-white    "
  onClick={() => setIsEditing(false)}
>
  Cancel Edit
</button>
          )}
          </span>
        
        {isEditing ? (
          <button
  onClick={() => {
    setOnConfirm(() => async () => {
      const documentId = selectedBooking.bookingId;
      if (!documentId) {
        showSnackbar("Missing Booking ID", "warning");
        return;
      }

      try {
        const DocRef = doc(db, "bookings", documentId);
        await deleteDoc(DocRef);
        showSnackbar(`Booking ${documentId} deleted successfully.`, "success");
        queryClient.invalidateQueries(["bookings"]);
        setModalOpen(false);
      } catch (error) {
        console.error("Delete failed:", error);
        showSnackbar("Failed to delete Booking.", "error");
      } finally {
        setConfirmOpen(false);
      }
    });
    setConfirmOpen(true);
  }}
>
  <span className="flex justify-center items-center text-white bg-red-600 hover:bg-red-800 font-semibold" style={{ padding: '2px 4px', borderRadius: '4px' }}>
    Delete Booking&nbsp;<DeleteIcon />
  </span>
</button>

        ) : <div />}

        {!isEditing && (
          <button
            className="text-gray-500 hover:text-black font-semibold"
            onClick={() => setModalOpen(false)}
          >
            <CloseIcon style={{ backgroundColor: 'red', color: 'white' }} />
          </button>
        )}
      </div>
      <div className="space-y-6 max-h-[80vh] overflow-auto bg-white  rounded-b-lg" style={{padding:'10px'}}>
  {!isEditing && (
     <div className="flex bg-gray-100 border-b rounded-t-lg" style={{ marginBottom: "10px" }}>
    {tabs.map((tab) => (
      <div
        key={tab.key}
        className={`text-sm font-medium border-b-2 ${
          activeTab === tab.key
            ? "border-blue-600 text-blue-600"
            : "border-transparent"
        } ${tab.disabled ? "text-gray-400 cursor-not-allowed" : "hover:text-blue-600 cursor-pointer"}`}
        onClick={() => {
          if (!tab.disabled) setActiveTab(tab.key);
        }}
        title={tab.disabled ? `No ${tab.label} exist` : ""}
        style={{
          padding: "8px 12px",
          marginRight: "8px",
        }}
      >
        {tab.label}
      </div>
    ))}
  </div>)}

      
      {modalLoading ? (
        <p className="text-sm">Loading booking information...</p>
      ) : (
        <>
          {!isEditing ? (

<>     {activeTab === TAB_KEYS.BOOKING && (
    <div> <div className=" text-sm">
<h3 className="font-semibold text-md  ">Booking Summary</h3>
<div className="bg-gray-100 p-3 rounded">
  <p><strong>ID:</strong> {selectedBooking.bookingId}</p>
  <p><strong>Package:</strong> {selectedBooking.pkgName}</p>
  <p><strong>Type:</strong> {selectedBooking.bookingType}</p>
  <p><strong>Amount:</strong> ₹{selectedBooking.pkgPrice}</p>
  <p><strong>Dates:</strong> {selectedBooking.startdate} - {selectedBooking.enddate}</p>
</div>
           
{selectedBooking?.items?.length > 0 && (
  <div className="   ">
    <h2 className="text-xl font-bold  ">Booking Items</h2>

    {(() => {
      const groupedItems = {};

      selectedBooking.items.forEach((item) => {
        const itemType = item.itemId;
        if (!groupedItems[itemType]) groupedItems[itemType] = [];

        item.rows?.forEach((row) => {
          groupedItems[itemType].push(row);
        });
      });

      return Object.entries(groupedItems).map(([itemType, rows]) => (
        <div key={itemType} className="     ">
          <h3 className="text-lg font-semibold  ">{itemType}</h3>
          <div className="overflow-x-auto border rounded">
<table className="w-full border border-gray-300 text-sm">
  <thead className="bg-gray-100">
    <tr>
      {TYPE_DEFAULT_FIELDS[itemType]?.map((field) => (
        <th key={field} className="border capitalize whitespace-nowrap">
          {field}
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    {rows.map((row, i) => (
      <tr key={i} className="even:bg-gray-50">
        {TYPE_DEFAULT_FIELDS[itemType]?.map((field) => (
          <td key={field} className="border whitespace-nowrap">
{row[field] !== undefined && row[field] !== ''
  ? row[field].toString()
  : '-'}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
          </div>
        </div>
      ));
    })()}
  </div>
)}


          </div></div>
  )}
       

 {activeTab === TAB_KEYS.INVOICE && hasInvoiceData && (
    <div>  {invoiceData && invoiceData.length > 0 && (
  <div className="   text-sm">
    <h3 className="font-semibold text-md  ">Invoices</h3>
    {invoiceData.map((invoice, idx) => (
      <div key={invoice.invoiceId || idx} className="  ">
        <div className="bg-gray-100 p-3 rounded  ">
          
          
        </div>
      </div>
    ))}
    <div className="  ">
  <h3 className="text-lg font-semibold  ">Bookings Covered in Invoices</h3>
  <ul className="list-disc       text-sm text-gray-700">
    {invoiceData.map((invoice, index) => {
      const uniqueBookingIds = Array.from(
        new Set((invoice.rows || []).map(row => row.bookingId))
      ).filter(Boolean); // Remove undefined/null
      return (
        <li key={index}>
          <span className="font-medium">{invoice.invoiceId || `Invoice ${index + 1}`}</span>:&nbsp;
          {uniqueBookingIds.length > 0 ? uniqueBookingIds.join(', ') : '-'}
        </li>
      );
    })}
  </ul>
</div>


    <table className="w-full text-sm border   ">
      <thead>
        <tr className="bg-gray-200">
          <th className="border">Invoice ID</th>
          <th className="border">Invoice Number</th>
          <th className="border">Invoice Date</th>
    <th className="border">Received Date</th>
    <th className="border">Due Date</th>
          <th className="border">Item</th>
          <th className="border">Code</th>
          <th className="border">Taxable</th>
          <th className="border">GST%</th>
          <th className="border">Amount</th>
        </tr>
      </thead>
      <tbody>
        {invoiceData.flatMap(invoice =>
          (invoice.rows || [])
.filter(row => row.bookingId === selectedBooking.id)
.map((row, i) => (
  <tr key={`${invoice.invoiceId}-${i}`}>
    <td className="border">{invoice.invoiceId}</td>
     <td className="border">{invoice.invoiceNumber || '-'}</td>
      <td className="border">{invoice.invoiceDate || '-'}</td>
      <td className="border">{invoice.invoiceReceiveDate || '-'}</td>
      <td className="border">{invoice.dueDate || '-'}</td>
    <td className="border">{row.item}</td>
    <td className="border">{row.itemCode}</td>
    <td className="border">₹{row.taxableValue}</td>
    <td className="border">{row.gstRate}%</td>
    <td className="border">₹{row.debitAmount}</td>
  </tr>
))
        )}
      </tbody>
      <tfoot>
  <tr>
    <td colSpan={9} className="text-right font-semibold border">
      Total Amount 
    </td>
    <td className="font-semibold border">
      ₹{
        invoiceData
          .flatMap(invoice =>
(invoice.rows || []).filter(row => row.bookingId === selectedBooking.id)
          )
          .reduce((sum, row) => sum + (parseFloat(row.debitAmount) || 0), 0)
          .toFixed(2)
      }
    </td>
  </tr>
</tfoot>


    </table>
  </div>
)}</div>
  )}



  {activeTab === TAB_KEYS.ADVISORY && hasAdvisoryData && (
    <div>{advisoryData && advisoryData.length > 0 && (
  <div className="   text-sm">
    <h3 className="font-semibold text-md  ">Payment Advisories</h3>

    <table className="w-full text-sm border">
      <thead>
        <tr className="bg-gray-200">
          <th className="border">Payment Advisory ID</th>
          <th className="border">Advisory Date</th>
          <th className="border">Invoice Booking ID</th>
          <th className="border">Total Bill </th>
          <th className="border">Paid</th>
          <th className="border">Remaining</th>
          <th className="border">Status</th>
        </tr>
      </thead>
      <tbody>
        {advisoryData.map((advisory, idx) => (
          <tr key={advisory.paymentAdvisoryId || idx}>
<td className="border">{advisory.paymentAdvisoryId}</td>
<td className="border">{advisory.paymentDate || '-'}</td>
<td className="border">{advisory.invoiceAdvisoryId || '-'}</td>
<td className="border">₹{advisory.totalDebitAmount || '0'}</td>
<td className="border">₹{advisory.allocatedAmount || '0'}</td>
<td className="border">₹{((advisory.totalDebitAmount || 0) - (advisory.allocatedAmount || 0)).toFixed(2)}</td>
<td className="border">
  {(advisory.totalDebitAmount || 0) - (advisory.allocatedAmount || 0) <= 0
    ? 'Paid'
    : 'Pending'}
</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}</div>
  )}


</>
          ) : (
<div className="text-center text-gray-500 font-medium text-lg py-40">
  Edit section (Coming Soon)
</div>
          )}
        </>
      )}
    </div>
    </div>
    </div>
  
)}
</div>


{modalOpen && selectedBooking && (
  <div
    className="fixed inset-0 flex items-center justify-center z-50"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
  >
    <div className="rounded-lg shadow-xl min-w-[70vw] relative bg-white max-h-[90vh] flex flex-col">
      {/* Header */}
      {/* <div className="flex justify-between items-center h-16 bg-[#0b80d3] rounded-t-lg" style={{ padding: '16px 24px' }}>
        <span className="flex gap-4 items-center">
          <h2 className="text-xl text-white font-bold flex-grow">
            {isEditing ? "Edit Booking Details" : "Booking Details"}
          </h2>
          {!isEditing && (
            <button
              className="border rounded-md text-[#005899] border-white hover:border-[#005899] bg-white transition-colors duration-200 flex items-center"
              onClick={() => setIsEditing(true)}
              style={{ padding: '6px' }}
            >
              <EditOutlinedIcon className="h-5 w-5" />
            </button>
          )}
          {isEditing && (
            <button
              className="border rounded-md text-[#005899] border-white hover:border-[#005899] bg-white transition-colors duration-200"
              onClick={() => setIsEditing(false)}
              style={{ padding: '6px 12px' }}
            >
              Cancel Edit
            </button>
          )}
        </span>
        
        {isEditing ? (
          <button
            onClick={() => {
              setOnConfirm(() => async () => {
                const documentId = selectedBooking.bookingId;
                if (!documentId) {
                  showSnackbar("Missing Booking ID", "warning");
                  return;
                }

                try {
                  const DocRef = doc(db, "bookings", documentId);
                  await deleteDoc(DocRef);
                  showSnackbar(`Booking ${documentId} deleted successfully.`, "success");
                  queryClient.invalidateQueries(["bookings"]);
                  setModalOpen(false);
                } catch (error) {
                  console.error("Delete failed:", error);
                  showSnackbar("Failed to delete Booking.", "error");
                } finally {
                  setConfirmOpen(false);
                }
              });
              setConfirmOpen(true);
            }}
          >
            <span className="flex justify-center items-center text-white bg-red-600 hover:bg-red-700 font-semibold rounded transition-colors duration-200" style={{ padding: '6px 12px' }}>
              Delete Booking&nbsp;<DeleteIcon className="h-5 w-5" />
            </span>
          </button>
        ) : <div />}

        {!isEditing && (
                 <button
                   className="text-gray-500 hover:text-black font-semibold"
                   onClick={() => setModalOpen(false)}
                 >
                   <CloseIcon style={{ backgroundColor: 'red', color: 'white' }} />
                 </button>
               )}
      </div> */}
      <div className="flex justify-between items-center h-16 bg-[#0b80d3] rounded-t-lg" style={{ padding: '16px 24px' }}>
  <span className="flex gap-4 items-center">
    <h2 className="text-xl text-white font-bold flex-grow">
      {isEditing ? "Edit Booking Details" : "Booking Details"}
    </h2>

    {!isEditing && (
      <button
        className="border rounded-md text-[#005899] border-white hover:border-[#005899] bg-white transition-colors duration-200 flex items-center"
        onClick={() => setIsEditing(true)}
        style={{ padding: '6px' }}
      >
        <EditOutlinedIcon className="h-5 w-5" />
      </button>
    )}

    {isEditing && (
      <>
        <button
          className="border rounded-md text-[#005899] border-white hover:border-[#005899] bg-white transition-colors duration-200"
          onClick={() => setIsEditing(false)}
          style={{ padding: '6px 12px' }}
        >
          Cancel Edit
        </button>

        <button
          onClick={() => {
            setOnConfirm(() => async () => {
              const documentId = selectedBooking.bookingId;
              if (!documentId) {
                showSnackbar("Missing Booking ID", "warning");
                return;
              }

              try {
                const DocRef = doc(db, "bookings", documentId);
                await deleteDoc(DocRef);
                showSnackbar(`Booking ${documentId} deleted successfully.`, "success");
                queryClient.invalidateQueries(["bookings"]);
                setModalOpen(false);
              } catch (error) {
                console.error("Delete failed:", error);
                showSnackbar("Failed to delete Booking.", "error");
              } finally {
                setConfirmOpen(false);
              }
            });
            setConfirmOpen(true);
          }}
        >
          <span className="flex justify-center items-center text-white bg-red-600 hover:bg-red-700 font-semibold rounded transition-colors duration-200" style={{ padding: '6px 12px' }}>
            Delete Booking&nbsp;<DeleteIcon className="h-5 w-5" />
          </span>
        </button>
      </>
    )}
  </span>

  <button
    className="text-gray-500 hover:text-black font-semibold"
    onClick={() => setModalOpen(false)}
  >
    <CloseIcon style={{ backgroundColor: 'red', color: 'white' }} />
  </button>
</div>


      {/* Content */}
      <div className="overflow-auto bg-white rounded-b-lg flex-1" style={{ padding: '0' }}>
        {!isEditing && (
          <div className="bg-gray-50 border-b" style={{ padding: '0 16px' }}>
            <div className="flex" style={{ margin: '0' }}>
              {tabs.map((tab) => (
                
                <div
                  key={tab.key}
                  className={`text-sm font-medium border-b-2 transition-colors duration-200 ${
                    activeTab === tab.key
                      ? "border-[#0b80d3] text-[#0b80d3]"
                      : "border-transparent text-gray-600"
                  } ${tab.disabled ? "text-gray-400 cursor-not-allowed" : "hover:text-[#0b80d3] cursor-pointer"}`}
                  onClick={() => {
                    if (!tab.disabled) setActiveTab(tab.key);
                  }}
                  title={tab.disabled ? `No ${tab.label} exist` : ""}
                  style={{
                    padding: '12px 16px',
                    
                    marginRight: '8px',
                    pointerEvents: 'auto', // Make sure tooltip still works
                  }}
                >
                  {tab.label}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: '24px' }}>
          {modalLoading ? (
            <div className="flex justify-center items-center" style={{ padding: '40px 0' }}>
              <p className="text-gray-500">Loading booking information...</p>
            </div>
          ) : (
            <>
              {!isEditing ? (
                <>
                  {activeTab === TAB_KEYS.BOOKING && (
                    <div style={{ margin: '0' }}>
                      <div className="text-sm">
                        <div className="flex items-center" style={{ marginBottom: '16px' }}>
                          <h3 className="text-lg font-semibold text-gray-800">Booking Summary</h3>
                        </div>
                        <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm" style={{ padding: '16px', marginBottom: '24px' }}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <p className="flex justify-between" style={{ marginBottom: '8px' }}>
                                <span className="text-gray-600 font-medium">Booking ID:</span>
                                <span className="font-semibold">{selectedBooking.bookingId}</span>
                              </p>
                              <p className="flex justify-between" style={{ marginBottom: '8px' }}>
                                <span className="text-gray-600 font-medium">Package Name:</span>
                                <span className="font-semibold">{selectedBooking.pkgName}</span>
                              </p>
                              <p className="flex justify-between" style={{ marginBottom: '8px' }}>
                                <span className="text-gray-600 font-medium">Booking Type:</span>
                                <span className="font-semibold">{selectedBooking.bookingType}</span>
                              </p>
                                <p className="flex justify-between" style={{ marginBottom: '8px' }}>
                                <span className="text-gray-600 font-medium">Duration:</span>
                                <span className="font-semibold">{selectedBooking.startdate} to {selectedBooking.enddate}</span>
                              </p>
                            </div>
                            <div>
                              <p className="flex justify-between" style={{ marginBottom: '8px' }}>
                                <span className="text-gray-600 font-medium">Total Package Amount:</span>
                                <span className="font-semibold">{selectedBooking.pkgPrice}</span>
                              </p>
                               <p className="flex justify-between" style={{ marginBottom: '8px' }}>
                                <span className="text-gray-600 font-medium">Discount:</span>
                                <span className="font-semibold">{selectedBooking.discount}</span>
                              </p>
                               <p className="flex justify-between" style={{ marginBottom: '8px' }}>
                                <span className="text-gray-600 font-medium">Total Payable Amount:</span>
                                <span className="font-semibold">{selectedBooking.toPay}</span>
                              </p>
                               <p className="flex justify-between" style={{ marginBottom: '8px' }}>
                                <span className="text-gray-600 font-medium">Booked By:</span>
                                <span className="font-semibold">{selectedBooking.bookedBy}</span>
                              </p>
                            
                            </div>
                          </div>
                        </div>
                        
                        {selectedBooking?.items?.length > 0 && (
                          <div style={{ margin: '0' }}>
                            <div className="flex items-center" style={{ marginBottom: '16px', marginTop: '24px' }}>
                              <h2 className="text-lg font-semibold text-gray-800">Booking Items</h2>
                            </div>

                            {(() => {
                              const groupedItems = {};

                              selectedBooking.items.forEach((item) => {
                                const itemType = item.itemId;
                                if (!groupedItems[itemType]) groupedItems[itemType] = [];

                                item.rows?.forEach((row) => {
                                  groupedItems[itemType].push(row);
                                });
                              });

                              return Object.entries(groupedItems).map(([itemType, rows]) => (
                                <div key={itemType} style={{ marginBottom: '24px' }}>
                                  <div className="flex items-center" style={{ marginBottom: '8px' }}>
                                    <h3 className="text-md font-semibold text-gray-700">{itemType}</h3>
                                  </div>
                                  <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                                    <table className="w-full border-collapse text-sm">
                                      <thead>
                                        <tr className="bg-gray-50">
                                          {TYPE_DEFAULT_FIELDS[itemType]?.map((field) => (
                                            <th key={field} className="border-b border-gray-200 capitalize text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>
                                              {field}
                                            </th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {rows.map((row, i) => (
                                          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            {TYPE_DEFAULT_FIELDS[itemType]?.map((field) => (
                                              <td key={field} className="border-b border-gray-200" style={{ padding: '12px 16px' }}>
                                                {row[field] !== undefined && row[field] !== ''
                                                  ? row[field].toString()
                                                  : '-'}
                                              </td>
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === TAB_KEYS.INVOICE && hasInvoiceData && (
                    <div style={{ margin: '0' }}>
                      {invoiceData && invoiceData.length > 0 && (
                        <div className="text-sm">
                          <div className="flex items-center" style={{ marginBottom: '16px' }}>
                            <h3 className="text-lg font-semibold text-gray-800">Invoices</h3>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg border border-gray-200 shadow-sm" style={{ padding: '16px', marginBottom: '24px' }}>
                            <div className="flex items-center" style={{ marginBottom: '12px' }}>
                              <h3 className="text-md font-semibold text-gray-700">Booking IDs in Vendor invoice.</h3>
                            </div>
                            <ul className="list-disc text-sm text-gray-700" style={{ paddingLeft: '24px' }}>
                              {invoiceData.map((invoice, index) => {
                                const uniqueBookingIds = Array.from(
                                  new Set((invoice.rows || []).map(row => row.bookingId))
                                ).filter(Boolean);
                                return (
                                  <li key={index} style={{ marginBottom: '4px' }}>
                                    <span className="font-medium">{invoice.invoiceId || `Invoice ${index + 1}`}</span>:&nbsp;
                                    {uniqueBookingIds.length > 0 ? uniqueBookingIds.join(', ') : '-'}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>

                          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm" style={{ marginBottom: '24px' }}>
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Invoice ID</th>
                                  <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Invoice Number</th>
                                  <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Invoice Date</th>
                                  <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Received Date</th>
                                  <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Due Date</th>
                                  <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Item</th>
                                  <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Code</th>
                                  <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Taxable</th>
                                  <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>GST%</th>
                                  <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {invoiceData.flatMap(invoice =>
                                  (invoice.rows || [])
                                    .filter(row => row.bookingId === selectedBooking.id)
                                    .map((row, i) => (
                                      <tr key={`${invoice.invoiceId}-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>{invoice.invoiceId}</td>
                                        <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>{invoice.invoiceNumber || '-'}</td>
                                        <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>{invoice.invoiceDate || '-'}</td>
                                        <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>{invoice.invoiceReceiveDate || '-'}</td>
                                        <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>{invoice.dueDate || '-'}</td>
                                        <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>{row.item}</td>
                                        <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>{row.itemCode}</td>
                                        <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>₹{row.taxableValue}</td>
                                        <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>{row.gstRate}%</td>
                                        <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>₹{row.debitAmount}</td>
                                      </tr>
                                    ))
                                )}
                              </tbody>
                              <tfoot>
                                <tr className="bg-gray-50">
                                  <td colSpan={9} className="text-right font-semibold border-t border-gray-200" style={{ padding: '12px 16px' }}>
                                    Total Amount 
                                  </td>
                                  <td className="font-semibold border-t border-gray-200" style={{ padding: '12px 16px' }}>
                                    ₹{
                                      invoiceData
                                        .flatMap(invoice =>
                                          (invoice.rows || []).filter(row => row.bookingId === selectedBooking.id)
                                        )
                                        .reduce((sum, row) => sum + (Number.parseFloat(row.debitAmount) || 0), 0)
                                        .toFixed(2)
                                    }
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                            {/* Profit Percentage Calculation */}
{selectedBooking?.toPay && (
  <div
    className="bg-gray-100 rounded text-sm text-gray-800 font-medium"
    style={{ marginTop: '12px', padding: '12px' }}
  >
    {(() => {
      const totalInvoiceAmount = invoiceData
        .flatMap(invoice =>
          (invoice.rows || []).filter(row => row.bookingId === selectedBooking.id)
        )
        .reduce((sum, row) => sum + (parseFloat(row.debitAmount) || 0), 0);

      const profitAmount = selectedBooking.toPay - totalInvoiceAmount;
      const profitPercentage = (profitAmount / selectedBooking.toPay) * 100;

      return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <span className="text-gray-600">Profit Amount:</span>{' '}
            ₹{profitAmount.toFixed(2)}
          </div>
          <div>
            <span className="text-gray-600">Profit Percentage:</span>{' '}
            <span
              className={
                profitPercentage < 0
                  ? 'text-red-600 font-semibold'
                  : 'text-green-600 font-semibold'
              }
            >
              {profitPercentage.toFixed(2)}%
            </span>
          </div>
        </div>
      );
    })()}
  </div>
)}


                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === TAB_KEYS.ADVISORY && hasAdvisoryData && (
                    <div style={{ margin: '0' }}>
                      {advisoryData && advisoryData.length > 0 && (
                        <div className="text-sm">
                          <div className="flex items-center" style={{ marginBottom: '16px' }}>
                            <h3 className="text-lg font-semibold text-gray-800">Payment Advisories</h3>
                          </div>

                          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                            <table className="w-full border-collapse text-sm">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Payment Advisory ID</th>
                                  <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Advisory Date</th>
                                  <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Invoice Booking ID</th>
                                  <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Total Bill</th>
                                  <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Paid</th>
                                  <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Remaining</th>
                                  <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {advisoryData.map((advisory, idx) => {
                                  const isPaid = (advisory.totalDebitAmount || 0) - (advisory.allocatedAmount || 0) <= 0;
                                  return (
                                    <tr key={advisory.paymentAdvisoryId || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                      <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>{advisory.paymentAdvisoryId}</td>
                                      <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>{advisory.paymentDate || '-'}</td>
                                      <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>{advisory.invoiceAdvisoryId || '-'}</td>
                                      <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>₹{advisory.totalDebitAmount || '0'}</td>
                                      <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>₹{advisory.allocatedAmount || '0'}</td>
                                      <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>₹{((advisory.totalDebitAmount || 0) - (advisory.allocatedAmount || 0)).toFixed(2)}</td>
                                      <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>
                                        <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${
                                          isPaid 
                                            ? 'bg-green-50 text-green-700' 
                                            : 'bg-yellow-50 text-yellow-700'
                                        }`}>
                                          {isPaid ? 'Paid' : 'Pending'}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          <div style={{ marginTop: '32px' }}>
  <div className="flex items-center" style={{ marginBottom: '16px' }}>
    <h3 className="text-lg font-semibold text-gray-800">Bank Statements</h3>
  </div>

  <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-gray-50">
          <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Ref No.</th>
          <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Payment Advisory ID</th>
          <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Vendor GSTIN</th>
          <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Total Paid</th>
          <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Date</th>
          <th className="border-b border-gray-200 text-left text-gray-600 font-medium" style={{ padding: '12px 16px' }}>Remarks</th>
        </tr>
      </thead>
      <tbody>
        {bankStatements.map((stmt, idx) =>
          stmt.noStatement ? (
            <tr key={`no-stmt-${idx}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border-b border-gray-200 text-gray-600 italic" colSpan={5} style={{ padding: '12px 16px' }}>
                No bank statement yet for <strong>{stmt.paymentAdvisoryId}</strong>
              </td>
            </tr>
          ) : (
            <tr key={stmt.refId || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
               <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>{stmt.refId}</td>
              <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>{stmt.paymentAdvisoryId}</td>
              <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>{stmt.vendorGSTIN}</td>
              <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>₹{stmt.totalPaid || 0}</td>
              <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>{stmt.Date || '-'}</td>
              <td className="border-b border-gray-200" style={{ padding: '12px 16px' }}>{stmt.remarks || '-'}</td>
            </tr>
          )
        )}
      </tbody>
    </table>
  </div>
</div>

                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className=" font-medium" style={{ padding: '10px 0' }}>
                  <div className="bg-gray-50 rounded-lg border border-gray-200" >
                     <InvoiceForm
    bookingData={selectedBooking}
    editMode={true}
    onClose={() => {
      setIsEditing(false);
      setModalOpen(false);
    }}
    onSuccess={() => {
      queryClient.invalidateQueries(['bookings']);
      setIsEditing(false);
      setModalOpen(false);
      showSnackbar('Booking updated successfully!', 'success');
    }}
    showSnackbar={showSnackbar}
  />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  </div>
)
}







{/* Snackbar */}
<Snackbar
  open={snackbar.open}
  autoHideDuration={4000}
  onClose={() => setSnackbar({ ...snackbar, open: false })}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <Alert
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    severity={snackbar.severity}
    variant="filled"
    sx={{ width: '100%' }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>

{/* Confirm Dialog */}
<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
  <DialogTitle
  >Confirm Delete</DialogTitle>
  <DialogContent>Are you sure you want to delete this Booking?</DialogContent>
  <DialogActions>
    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
    <Button onClick={() => onConfirm()} color="error" variant="contained">Delete</Button>
  </DialogActions>
</Dialog>





    </div>
    
  );
}

