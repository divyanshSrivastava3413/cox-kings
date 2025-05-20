

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { db } from "../Firebase/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';


import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { storage,ref,uploadBytesResumable } from "../Firebase/firebase";
import { getDownloadURL } from "firebase/storage";
import { TextField, MenuItem } from "@mui/material";
import GlobalTextFieldHoverStyle from "./GlobalTextFieldHoverStyle";
import { Info, ContactMail, AccountBalance } from '@mui/icons-material';
import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';









const RECORDS_PER_PAGE = 10;

export function CustomerTable() {
  const queryClient = useQueryClient();
  //Add state for editing mode for customer 
  const [isEditing, setIsEditing] = useState(false);
const [editFormData, setEditFormData] = useState(null);

const [selectedStatus, setSelectedStatus] = useState("All");


// Snackbar state
const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
const showSnackbar = (message, severity = "info") => {
  setSnackbar({ open: true, message, severity });
};

// Confirmation dialog state
const [confirmOpen, setConfirmOpen] = useState(false);
const [onConfirm, setOnConfirm] = useState(() => () => {});

// ✅ Helper to determine document ID
const getCustomerDocumentId = (data) => {
  if (data.type === "B2B") {
    return data.gstin?.trim();
  } else if (data.type === "B2C") {
    return data.pan?.trim() || data.aadhar?.trim();
  }
  return "";
};



  
  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const customersCollection = collection(db, "masters/ONBOARDING/CUSTOMER");
      const snapshot = await getDocs(customersCollection);
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  
// ✅ Updated addCustomer to use dynamic ID (not just PAN)
const addCustomer = async (customer) => {
  const customersCollection = collection(db, "masters/ONBOARDING/CUSTOMER");
  const documentId = getCustomerDocumentId(customer);
  const customerDocRef = doc(customersCollection, documentId);
  await setDoc(customerDocRef, customer);
};
  

  const mutate = useMutation({
    mutationFn: addCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
    },
    onError: (error) => {
      console.error("Error adding customer", error);
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  
  const filteredCustomers = data
  .filter(customer =>
    selectedStatus === "All" ? true : customer.status === selectedStatus
  )
  .filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.pan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const totalPages = Math.ceil(filteredCustomers.length / RECORDS_PER_PAGE);
  const currentRecords = filteredCustomers.slice(
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
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 3 });
      const [headerRow, ...dataRows] = rawData;

      const jsonData = dataRows.map((row) => {
        const rowObj = {};
        headerRow.forEach((key, idx) => {
          rowObj[key] = row[idx];
        });
        return rowObj;
      });

      const customerCollection = collection(db, "masters/ONBOARDING/CUSTOMER");
      const existingDocs = await getDocs(customerCollection);
      const existingIds = existingDocs.docs.map((doc) => doc.id);

      const REQUIRED_FIELDS = ["Name", "Type"];
      const skippedRows = [];

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        const excelRowNum = i + 5;

        // Normalize string values
        const type = (row["Type"] || "B2C").toString().trim().toUpperCase();
        row["Type"] = type;
        row["PAN"] = row["PAN"]?.toString().trim();
        row["GSTIN"] = row["GSTIN"]?.toString().trim();
        row["Aadhar"] = row["Aadhar"]?.toString().trim();

        const missingFields = [];

        if (!row["Name"] || String(row["Name"]).trim() === "") {
          missingFields.push("Name");
        }

        if (!type) {
          missingFields.push("Type");
        } else if (type === "B2B") {
          if (!row["GSTIN"]) missingFields.push("GSTIN");
        } else if (type === "B2C") {
          if (!row["PAN"] && !row["Aadhar"]) {
            missingFields.push("PAN or Aadhar");
          }
        }

        if (missingFields.length > 0) {
          skippedRows.push({
            rowNumber: excelRowNum,
            reason: "Missing required fields",
            missingFields,
            row,
          });
          continue;
        }

        const documentId =
          type === "B2B"
            ? row["GSTIN"]
            : row["PAN"] || row["Aadhar"];

        if (!documentId) {
          skippedRows.push({
            rowNumber: excelRowNum,
            reason: "Could not determine document ID",
            row,
          });
          continue;
        }

        if (existingIds.includes(documentId)) {
          skippedRows.push({
            rowNumber: excelRowNum,
            reason: "Duplicate document ID",
            row,
          });
          continue;
        }

        const customer = {
          name: row["Name"],
          address: row["Address"],
          city: row["City"],
          pincode: row["Pincode"] || "",
          email: row["Email"],
          phone: row["Phone"],
          pan: row["PAN"] || "",
          aadhar: row["Aadhar"] || "",
          gstin: row["GSTIN"] || "",
          tan: row["TAN"] || "",
          turnover: row["Turnover"] || "",
          tds: row["TDS"] || "",
          tcs: row["TCS"] || "",
          status: row["Status"] || "Pending",
          type: type,
          documentNumber: documentId,
        };

        try {
          const customerRef = doc(db, "masters/ONBOARDING/CUSTOMER", documentId);
          await setDoc(customerRef, customer);
          console.log(`✅ Row ${excelRowNum} uploaded successfully.`);
        } catch (err) {
          console.error(`❌ Row ${excelRowNum} failed to upload:`, err);
          skippedRows.push({
            rowNumber: excelRowNum,
            reason: err.message || "Upload error",
            row,
          });
        }
      }

      if (skippedRows.length > 0) {
        console.warn("⏭️ Skipped rows summary:", skippedRows);
      }
    } catch (err) {
      console.error("❌ File processing failed:", err);
    }
  };

  reader.readAsArrayBuffer(file);
};


const getImageAsArrayBuffer = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
};

const handleExport = async (title) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`${title}`);

  // Columns for customer onboarding data
  worksheet.columns = [
    { header: "Name", key: "name", width: 20 },
    { header: "Address", key: "address", width: 25 },
    { header: "City", key: "city", width: 15 },
    { header: "Pincode", key: "pincode", width: 10 },
    { header: "Email", key: "email", width: 25 },
    { header: "Phone", key: "phone", width: 15 },
    { header: "PAN", key: "pan", width: 15 },
    { header: "Aadhar", key: "aadhar", width: 20 },
    { header: "GSTIN", key: "gstin", width: 20 },
    { header: "TAN", key: "tan", width: 15 },
    { header: "Turnover", key: "turnover", width: 15 },
    { header: "TDS", key: "tds", width: 10 },
    { header: "TCS", key: "tcs", width: 10 },
    { header: "Status", key: "status", width: 12 },
    { header: "Type", key: "type", width: 10 },
  ];

  // Add title and metadata
  worksheet.spliceRows(1, 0, [], [], []);
  worksheet.getRow(1).height = 75;
  worksheet.getRow(2).height = 30;
  worksheet.getCell('D1').value = title;
  worksheet.getCell('E1').value = 'Generated On: ' + new Date().toLocaleDateString();
  worksheet.getCell('K1').value = 'Powered By';

  // Style title rows (Row 1 and 2) with a darker gray background and bold font
  const headerColumns = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N','O'];
  headerColumns.forEach(col => {
    ['1', '2'].forEach(row => {
      const cell = `${col}${row}`;
      worksheet.getCell(cell).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFA0A0A0' } // Darker gray
      };
      worksheet.getCell(cell).font = { bold: true, size: 12 };
    });
  });

  // Add logos
  try {
    const logoPaths = [
      { path: '/AcctAbility_transparent.png', position: { tl: { col: 0, row: 0 }, br: { col: 1, row: 2 } } },
      { path: '/images/clientlogo.png', position: { tl: { col: 1, row: 0 }, ext: { width: 150, height: 80 } } },
      { path: '/images/Logo circle-cropped.png', position: { tl: { col: 11, row: 0 }, br: { col: 13, row: 2 } } }
    ];

    for (const logo of logoPaths) {
      const buffer = await getImageAsArrayBuffer(logo.path);
      const imageId = workbook.addImage({ buffer, extension: 'png' });
      worksheet.addImage(imageId, { ...logo.position, editAs: 'oneCell' });
    }

    ['A1', 'A2', 'B1', 'B2'].forEach(cell => {
      worksheet.getCell(cell).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFA0A0A0' }
      };
    });
  } catch (error) {
    console.error("Failed to add logo:", error);
  }

  // Add space after title
  worksheet.getRow(3).height = 20;

  // Style header row
  const headerRow = worksheet.getRow(4);
  headerRow.font = { bold: true };
  headerRow.height = 20;
  headerRow.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // 💾 Fill with your actual customer data here
  data.forEach(c => {
    worksheet.addRow({
      name: c.name,
      address: c.address,
      city: c.city,
      pincode: c.pincode || "",
      email: c.email,
      phone: c.phone,
      pan: c.pan || "",
      aadhar: c.aadhar || "",
      gstin: c.gstin || "",
      tan: c.tan || "",
      turnover: c.turnover || "",
      tds: c.tds || "",
      tcs: c.tcs || "",
      status: c.status || "Pending", // Default status
      type: c.type,
    });
  });

  // Style data rows
  for (let i = 5; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);

    // Dynamically color the 'status' column based on its value
    const statusCell = row.getCell('status');
    switch (statusCell.value) {
      case 'Pending':
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC000' } }; // Yellow
        break;
      case 'Active':
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '92D050' } }; // Green
        break;
      case 'Inactive':
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6B6B' } }; // Red
        break;
      case 'Completed':
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '6B62C5' } }; // Purple
        break;
      default:
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC000' } }; // Default Yellow
    }

    row.eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  }

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, cell => {
      const val = cell.value ? cell.value.toString() : '';
      if (val.length > maxLength) maxLength = val.length;
    });
    column.width = Math.max(12, maxLength + 2);
  });

  // Generate Excel file and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  saveAs(blob, `${title.replace(/\s+/g, '_')}_report.xlsx`);
};



 const handleView = (customer) => {
  setSelectedCustomer(customer);
  setEditFormData(customer); // Initialize form data
  setIsEditing(false);
  setModalOpen(true);
};

const handleEdit = (customer) => {
  setSelectedCustomer(customer);
  setEditFormData(customer); // Initialize form data
  setIsEditing(true);
  setModalOpen(true);
};






// ✅ Updated save to use correct document ID
const handleSave = async () => {
  try {
    const documentId = getCustomerDocumentId(editFormData);
    const customerDocRef = doc(db, "masters", "ONBOARDING", "CUSTOMER", documentId);

    await updateDoc(customerDocRef, editFormData);

    setSelectedCustomer(editFormData);
    alert(`Updated Customer ${editFormData.name} details`);
    queryClient.invalidateQueries(['customers']);
    setModalOpen(false);
  } catch (error) {
    console.error("Error updating customer:", error);
    alert("Failed to update customer.");
  }
};
const downloadTemplate = async () => {
    try {
      const fileRef = ref(storage, "Template/Customer_Template.xlsx"); // Adjust path
      const url = await getDownloadURL(fileRef);

      // Create a temporary <a> element to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "vendor-file.xlsx"; // File name to save as
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file.");
    }
  };


const Section = ({ title, children }) => (
  <div className=" border-2 border-blue-200 rounded-lg   " style={{margin:'6px 0px'}}>
    <h3 className="text-md font-semibold text-black  h-8 flex justify-start items-center bg-blue-200 rounded-t-lg" style={{padding:'6px'}}>{title}</h3>
    <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm " style={{padding:'6px'}}>
      {children}
    </div>
  </div>
);

const Field = ({ label, value }) => (
  <div>
    <label className="text-gray-800 font-semibold block ">{label}</label>
    <p className="text-gray-600 ">{value || "N/A"}</p>
  </div>
);














  return (
    <div className=" space-y-6 bg-white shadow rounded-lg w-[75vw] h-auto flex flex-col justify-center items-center gap-4 " style={{padding:'12px'}}>
        <div className="w-[95%] flex justify-between items-center" style={{padding:'4px'}}>
          <div className="flex justify-start items-center gap-2"><h1 className="text-3xl text-black font-bold">Customers</h1>
       <div className="w-[95%]  relative">
  {/* Filter Icon */}
  <div className="absolute inset-y-0 left-0  flex items-center pointer-events-none" style={{padding:'4px'}}>
    <FilterListIcon className="text-gray-500" fontSize="small" />
  </div>

  {/* Dropdown */}
  <select
    value={selectedStatus}
    onChange={(e) => {
      setSelectedStatus(e.target.value);
      setCurrentPage(1);
    }}
    className="  w-full rounded-md border border-gray-300 bg-white text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005899]"
    style={{padding:'2px 2px 2px 20px'}}
  >
    {["All", "Active", "Inactive", "Pending"].map((status) => (
      <option key={status} value={status}>
        {status}
      </option>
    ))}
  </select>
</div>
</div>
<Link to={"/New-customer"} className="text-sm bg-black text-white rounded-lg" style={{padding:'4px'}} ><PersonAddIcon/> &nbsp;Create New Customer</Link></div>
      <div className="flex justify-between items-end  w-[95%]">
        <div className="flex flex-col w-1/3 ">
         <div className="relative w-full">
  <span className="absolute inset-y-0 left-0  flex items-center pointer-events-none text-gray-500">
    <SearchIcon fontSize="small" />
  </span>
  <input

    type="text"
    id="search"
    className="border  rounded-lg w-[90%] h-8 hover:border-[#005899] focus:outline-none"
    placeholder="Search customers..."
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    }}
    style={{padding:'2px 0 2px 20px'}}
  />
</div>


        </div>
        <div className="flex  justify-between items-end gap-2 text-sm " >
          
            <button onClick={downloadTemplate} className="border  rounded-lg cursor-pointer bg-[#005899] text-white flex items-center" style={{padding:'6px 10px'}}>
      <DownloadOutlinedIcon />Download Upload Template
    </button>
          

          <label className="border  rounded-lg cursor-pointer bg-black text-white flex items-center" style={{padding:'6px'}}>
            <UploadOutlinedIcon/>Import
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <button
  className="border  rounded-lg bg-black text-white"
  onClick={() => handleExport("Customer Report")} // Pass the function reference correctly
  style={{ padding: '6px' }}
>
  <DownloadOutlinedIcon /> Export
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
  <thead className="bg-[#e6f0f7] ">
    <tr className="h-8">
      <th className="   text-left text-sm font-semibold text-gray-600" style={{ padding: '4px' }}>Name</th>
      <th className="   text-left text-sm font-semibold text-gray-600" style={{ padding: '4px' }}>Email</th>
      <th className="   text-left text-sm font-semibold text-gray-600" style={{ padding: '4px' }}>Type</th>
      <th className="   text-left text-sm font-semibold text-gray-600" style={{ padding: '4px' }}>Document ID</th>
      <th className="   text-left text-sm font-semibold text-gray-600" style={{ padding: '4px' }}>Status</th>
      <th className="   text-right text-sm font-semibold text-gray-600" style={{ padding: '4px' }}>Actions</th>
    </tr>
  </thead>
  <tbody>
    {currentRecords.map((customer) => (
      <tr key={customer.id} className="border border-black hover:bg-gray-50 h-8 ">
        <td  style={{ padding: '4px' }}>{customer.name}</td>
        <td style={{ padding: '4px' }}>{customer.email}</td>
        
        {/* Type with Badge */}
        <td className="  " style={{ padding: '4px' }}>
          {customer.type === "B2B" && (
            <span className="inline-flex items-center justify-center  text-xs font-medium rounded-full bg-sky-100 text-sky-600" style={{padding:'2px 4px'}}>
              B2B
            </span>
          )}
          {customer.type === "B2C" && (
            <span className="inline-flex items-center justify-center  text-xs font-medium rounded-full bg-blue-100 text-blue-600" style={{padding:'2px 4px'}}>
              B2C
            </span>
          )}
        </td>

        <td  style={{ padding: '4px' }}>{getCustomerDocumentId(customer)}</td>
        
        {/* Status with Badge */}
        <td  style={{ padding: '4px' }}>
          {customer.status === "Active" && (
            <span className="inline-flex items-center justify-center   text-xs font-medium rounded-full bg-green-100 text-green-700" style={{padding:'2px 4px'}}>
              Active
            </span>
          )}
          {customer.status === "Inactive" && (
            <span className="inline-flex items-center justify-center   text-xs font-medium rounded-full bg-gray-100 text-gray-600" style={{padding:'2px 4px'}}>
              Inactive
            </span>
          )}
          {customer.status === "Pending" && (
            <span className="inline-flex items-center justify-center   text-xs font-medium rounded-full bg-amber-100 text-amber-600" style={{padding:'2px 4px'}}>
              Pending
            </span>
          )}
        </td>

        <td className="   text-right" style={{ padding: '4px' }}>
          <button
            className="border   rounded-md text-[#005899] border-white hover:border-[#005899] bg-white"
            onClick={() => {
              handleView(customer);
              setSelectedCustomer(customer);
              setIsEditing(false);
              setModalOpen(true);
            }}
            style={{ padding: '4px' }}
          >
            <VisibilityOutlinedIcon/>
          </button>

          <button
            className="border   rounded-md text-[#005899] border-white hover:border-[#005899] bg-white  "
            onClick={() => {
              handleEdit(customer);
              setSelectedCustomer(customer);
              setIsEditing(true);
              setModalOpen(true);
            }}
            style={{ padding: '4px' }}
          >
            <EditOutlinedIcon/>
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

          </div>

          <div className="flex justify-end items-center gap-2 ">
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

      {/* Add Customer Form*/ }
      



{modalOpen && selectedCustomer && editFormData && (
  <div className="fixed inset-0 flex items-center justify-center z-50" style={{
    backgroundColor: "rgba(0, 0,0, 0.4)", // change alpha for more/less dim
    
  }}>
    <div className=" rounded-lg shadow-xl max-w-2xl w-full relative " >
      
      
      <div className="flex justify-between items-center  h-16 bg-[#0b80d3] rounded-t-lg" style={{padding:'10px'}}>
        <span className="flex gap-4 items-center">
             <h2 className="text-2xl text-white font-bold  flex-grow">
               {isEditing ? "Edit Customer Details" : "Customer Details"}
             </h2>
             {!isEditing && (
      <button
        className="border  rounded-md text-[#005899] border-white hover:border-[#005899] bg-white    "
        onClick={() => setIsEditing(true)}
        style={{padding:'4px'}}
      >
        <EditOutlinedIcon/>
      </button>
    )}</span>
        
        {isEditing ? (
          <button
  onClick={() => {
    setOnConfirm(() => async () => {
      const documentId = getCustomerDocumentId(editFormData);
      if (!documentId) {
        showSnackbar("Missing document ID (GSTIN/PAN/Aadhar)", "warning");
        return;
      }

      try {
        const customerDocRef = doc(db, "masters", "ONBOARDING", "CUSTOMER", documentId);
        await deleteDoc(customerDocRef);
        showSnackbar(`Customer ${editFormData.name} deleted successfully.`, "success");
        queryClient.invalidateQueries(["customers"]);
        setModalOpen(false);
      } catch (error) {
        console.error("Delete failed:", error);
        showSnackbar("Failed to delete customer.", "error");
      } finally {
        setConfirmOpen(false);
      }
    });
    setConfirmOpen(true);
  }}
>
  <span className="flex justify-center items-center text-white bg-red-600 hover:bg-red-800 font-semibold" style={{ padding: '2px 4px', borderRadius: '4px' }}>
    Delete Customer&nbsp;<DeleteIcon />
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

    
      {!isEditing ? (
 
  <div className="space-y-6 max-h-[70vh] overflow-auto bg-white  rounded-b-lg" style={{padding:'10px'}}>
  
  {/* Total Orders Card */}
  {/* <div className="mb-2 w-[20%]">
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg p-4 shadow-lg flex items-center justify-center mb-4">
  <div className="flex flex-col justify-center items-center gap-1">
    <h4 className=" font-light">Total Orders</h4>
    <p className="text-2xl font-bold">123</p> 
  </div>
  
</div>

  </div> */}

  {/* Section: Basic Info */}
  <Section title={
    <div className="flex items-center gap-2 ">
      <span>Basic Information</span>
      <Info style={{ fontSize: 20 }} />
      
    </div>
  } >
    <Field label="Name" value={selectedCustomer?.name} />
    <Field label="Customer Type" value={selectedCustomer?.type} />
    <Field label="Aadhar" value={selectedCustomer?.aadhar} />
    <Field label="Status" value={selectedCustomer?.status} />
  </Section>
  

  {/* Section: Contact Info */}
  <Section title={
    <div className="flex items-center gap-2 ">
      <span>Contact Information</span>
      <ContactMail style={{ fontSize: 20 }} />
      
    </div>
  }>
    <Field label="Email" value={selectedCustomer?.email} />
    <Field label="Phone" value={selectedCustomer?.phone} />
    <Field label="Country" value={selectedCustomer?.country} />
    <Field label="State" value={selectedCustomer?.state} />
    <Field label="City" value={selectedCustomer?.city} />
    <Field label="Address" value={selectedCustomer?.address} />
    <Field label="Pincode" value={selectedCustomer?.pincode} />
  </Section>

  {/* Section: Statutory & Financial Info */}
  <Section  title={
    <div className="flex items-center gap-2 ">
      <span>Statutory & Financial Information</span>
      <AccountBalance style={{ fontSize: 20 }} />
      
    </div>
  }>
    <Field label="PAN" value={selectedCustomer?.pan} />
    
    <Field label="TAN" value={selectedCustomer?.tan} />
    <Field label="GSTIN" value={selectedCustomer?.gstin} />
    
    <Field label="TDS" value={selectedCustomer?.tds} />
    <Field label="TCS" value={selectedCustomer?.tcs} />
  </Section>
</div>

) : (
  
  


  
  <div className="space-y-6 max-h-[80vh] overflow-auto bg-white " style={{ padding: '10px' }}>
    <GlobalTextFieldHoverStyle />

    {/* Basic Information */}
    <div className="border-2 border-blue-200 rounded-lg 
    " style={{ margin: '6px 0px' }}>
      <h3 className="text-md font-semibold text-black  h-8 flex items-center bg-blue-200 rounded-t-lg" style={{ padding: '6px' }}>
        Basic Information &nbsp;<Info/>
      </h3>
      <div className="grid grid-cols-2 gap-4" style={{ padding: '10px' }}>
        <TextField
          label="Name"
          fullWidth
          size="small"
          value={editFormData.name || ""}
          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
        />
        <TextField
          label="Customer Type"
          fullWidth
          size="small"
          select
          value={editFormData.type || ""}
          onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
        >
          {["B2B", "B2C"].map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Aadhar"
          fullWidth
          size="small"
          value={editFormData.aadhar || ""}
          onChange={(e) => setEditFormData({ ...editFormData, aadhar: e.target.value })}
        />
        <TextField
          label="Status"
          fullWidth
          size="small"
          select
          value={editFormData.status || ""}
          onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
        >
          {["Active", "Inactive","Pending"].map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </TextField>
      </div>
    </div>

    {/* Contact Information */}
    <div className="border-2 border-blue-200 rounded-lg " style={{ margin: '6px 0px' }}>
      <h3 className="text-md font-semibold text-black 
       h-8 flex items-center bg-blue-200 rounded-t-lg" style={{ padding: '6px' }}>
        Contact Information &nbsp;<ContactMail/>
      </h3>
      <div className="grid grid-cols-2 gap-4" style={{ padding: '10px' }}>
        <TextField
          label="Email"
          fullWidth
          size="small"
          value={editFormData.email || ""}
          onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
        />
        <TextField
          label="Phone"
          fullWidth
          size="small"
          value={editFormData.phone || ""}
          onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
        />
        <TextField
          label="Country"
          fullWidth
          size="small"
          value={editFormData.country || ""}
          onChange={(e) => setEditFormData({ ...editFormData, country: e.target.value })}
        />
        <TextField
          label="State"
          fullWidth
          size="small"
          value={editFormData.state || ""}
          onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
        />
        <TextField
          label="City"
          fullWidth
          size="small"
          value={editFormData.city || ""}
          onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
        />
        <TextField
          label="Address"
          fullWidth
          size="small"
          value={editFormData.address || ""}
          onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
        />
        <TextField
          label="Pincode"
          fullWidth
          size="small"
          value={editFormData.pincode || ""}
          onChange={(e) => setEditFormData({ ...editFormData, pincode: e.target.value })}
        />
      </div>
    </div>

    {/* Statutory & Financial Information */}
    <div className="border-2 border-blue-200 rounded-lg " style={{ margin: '6px 0px' }}>
      <h3 className="text-md font-semibold text-black  h-8 flex items-center bg-blue-200 rounded-t-lg" style={{ padding: '6px' }}>
        Statutory & Financial Information &nbsp;<AccountBalance/>
      </h3>
      <div className="grid grid-cols-2 gap-4" style={{ padding: '10px' }}>
        <TextField
          label="PAN"
          fullWidth
          size="small"
          value={editFormData.pan || ""}
          onChange={(e) => setEditFormData({ ...editFormData, pan: e.target.value })}
        />
        <TextField
          label="TAN"
          fullWidth
          size="small"
          value={editFormData.tan || ""}
          onChange={(e) => setEditFormData({ ...editFormData, tan: e.target.value })}
        />
        <TextField
          label="GSTIN"
          fullWidth
          size="small"
          value={editFormData.gstin || ""}
          onChange={(e) => setEditFormData({ ...editFormData, gstin: e.target.value })}
        />
        <TextField
          label="TDS"
          fullWidth
          size="small"
          value={editFormData.tds || ""}
          onChange={(e) => setEditFormData({ ...editFormData, tds: e.target.value })}
        />
        <TextField
          label="TCS"
          fullWidth
          size="small"
          value={editFormData.tcs || ""}
          onChange={(e) => setEditFormData({ ...editFormData, tcs: e.target.value })}
        />
      </div>
    </div>
  </div>





)}


      
      {isEditing && (
        <div className=" flex justify-end gap-3 h-10 items-end bg-white rounded-b-lg" style={{padding:'10px'}}>
          <button
            className="bg-gray-600 text-white rounded hover:bg-gray-500"
            style={{ padding: '2px 4px' }}
            onClick={() => {
              setModalOpen(false);
              setIsEditing(false);
            }}
          >
            Cancel
          </button>
          {/* <button
  className="bg-green-600 text-white rounded hover:bg-green-500"
  style={{ padding: '2px 4px' }}
  onClick={async () => {
    try {
      const documentId = getCustomerDocumentId(editFormData);
      if (!documentId) {
        showSnackbar("Missing document ID (GSTIN/PAN/Aadhar)", "warning");
        return;
      }

      const customerDocRef = doc(db, "masters", "ONBOARDING", "CUSTOMER", documentId);
      await updateDoc(customerDocRef, editFormData);
      showSnackbar(`Updated Customer ${editFormData.name} details`, "success");
      queryClient.invalidateQueries(['customers']);
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating customer:", error);
      showSnackbar("Failed to update customer.", "error");
    }
  }}
>
  Save
</button> */}

    <button
  className="bg-green-600 text-white rounded hover:bg-green-500"
  style={{ padding: '2px 4px' }}
  onClick={async () => {
    const oldDocId = getCustomerDocumentId(selectedCustomer);
    const newDocId = getCustomerDocumentId(editFormData);

    if (!newDocId) {
      showSnackbar("Missing document ID (GSTIN/PAN/Aadhar)", "warning");
      return;
    }

    try {
      const oldRef = doc(db, "masters", "ONBOARDING", "CUSTOMER", oldDocId);
      const newRef = doc(db, "masters", "ONBOARDING", "CUSTOMER", newDocId);

      if (oldDocId !== newDocId) {
        // Optional: prevent overwriting another customer if new ID exists
        const existingDoc = await getDoc(newRef);
        if (existingDoc.exists()) {
          showSnackbar("A customer with the new document ID already exists.", "error");
          return;
        }

        // Delete old doc and create new one
        await deleteDoc(oldRef);
        await setDoc(newRef, editFormData);
      } else {
        // Just update the existing doc
        await updateDoc(oldRef, editFormData);
      }

      showSnackbar(`Updated Customer ${editFormData.name} details`, "success");
      queryClient.invalidateQueries(['customers']);
      setModalOpen(false);
    } catch (error) {
      console.error("Error updating customer:", error);
      showSnackbar("Failed to update customer.", "error");
    }
  }}
>
  Save
</button>


        </div>
      )}
    </div>
  </div>
)}
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
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>Are you sure you want to delete this customer?</DialogContent>
  <DialogActions>
    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
    <Button onClick={() => onConfirm()} color="error" variant="contained">Delete</Button>
  </DialogActions>
</Dialog>





    </div>
  );
}

