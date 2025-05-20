

import React, { useState } from "react";
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
import SearchIcon from '@mui/icons-material/Search';
import { TextField, MenuItem, Dialog } from "@mui/material";
import GlobalTextFieldHoverStyle from "./GlobalTextFieldHoverStyle";
import { Snackbar, Alert, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotesIcon from '@mui/icons-material/Notes';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import FilterListIcon from '@mui/icons-material/FilterList';




const RECORDS_PER_PAGE = 10;

export function VendorTable() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [selectedType, setSelectedType] = useState("All");
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };
  
  // Confirmation dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [onConfirm, setOnConfirm] = useState(() => () => {});
  

  // ✅ Helper to determine document ID
const getVendorDocumentId = (data) => {
  if (data.type === "B2B") {
    return data.gstin?.trim();
  } else if (data.type === "B2C") {
    return data.pan?.trim() ;
  }
  return "";
};

const downloadTemplate = async () => {
      try {
        const fileRef = ref(storage, "Template/Vendor_Template.xlsx"); // Adjust path
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
  

  
  
  const fetchVendors = async () => {
    try {
      const vendorCollection = collection(db, "masters/ONBOARDING/VENDOR");
      const snapshot = await getDocs(vendorCollection);
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
    } catch (error) {
      console.error("Error fetching Vendors:", error);
    }
  };

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ['vendors'],
    queryFn: fetchVendors,
  });

  const addVendor = async (vendor) => {
    const vendorsCollection = collection(db, "masters/ONBOARDING/VENDOR");
    const documentId = getVendorDocumentId(vendor);
    if (!documentId) {
  throw new Error("Vendor document ID (GSTIN or PAN) is required.");
}
    const vendorDocRef = doc(vendorsCollection, documentId); // Set the document ID as GSTIN
        await setDoc(vendorDocRef, vendor);  // Store the vendor data with the GSTIN as the document ID
  };

  const mutate = useMutation({
    mutationFn: addVendor,
    onSuccess: () => {
      queryClient.invalidateQueries(['vendors']);
    },
    onError: (error) => {
      console.error("Error adding vendor", error);
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // const filteredVendors = data.filter(
  //   (vendor) =>
    
  //   vendor.vendorType?.toLowerCase().includes(searchTerm.toLowerCase())||
  //     vendor.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     vendor.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     vendor.gstin?.toLowerCase().includes(searchTerm.toLowerCase())

  // );
  const filteredVendors = data
  .filter(vendor =>
    selectedType === "All" ? true : vendor.type === selectedType
  )
  .filter(vendor =>
       vendor.vendorType?.toLowerCase().includes(searchTerm.toLowerCase())||
       vendor.type?.toLowerCase().includes(searchTerm.toLowerCase())||
      vendor.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const totalPages = Math.ceil(filteredVendors.length / RECORDS_PER_PAGE);
  const currentRecords = filteredVendors.slice(
    (currentPage - 1) * RECORDS_PER_PAGE,
    currentPage * RECORDS_PER_PAGE
  );

  // const handleFileUpload = async (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = async (event) => {
  //     try {
  //       const data = new Uint8Array(event.target.result);
  //       const workbook = XLSX.read(data, { type: "array" });
  //       const sheetName = workbook.SheetNames[0];
  //       const sheet = workbook.Sheets[sheetName];
  //       const jsonData = XLSX.utils.sheet_to_json(sheet);
  //       // 🔥 STEP 1: fetch existing Vendors
  //               const vendorsCollection = collection(db, "masters/ONBOARDING/VENDOR");
  //               const snapshot = await getDocs(vendorsCollection);
  //               const existingIds = snapshot.docs.map(doc => doc.id);
          
  //               const REQUIRED_FIELDS = ["pan", "contactName","gstin","vendorType"];
  //               const skippedRows = [];
          

  //       jsonData.forEach((row,index) => {
  //          const type = row["type"] || "B2C"; // Default to B2C if not specified
  //       const documentId = getVendorDocumentId({ ...row, type });

  //       // 🟡 Validate required fields
  //       const required = [...REQUIRED_FIELDS];
  //       if (type === "B2B") required.push("gstin");
  //       if (type === "B2C") required.push("pan"); // we'll allow pan or aadhar in code
  //           console.log(`Processing row ${index + 2}`, row);
  //         const missingFields = REQUIRED_FIELDS.filter(
  //           (field) => !row[field] || String(row[field]).trim() === ""
  //         );

  //         // For B2C: make sure either PAN is present
  //       if (type === "B2C" && !row["pan"]?.trim() ) {
  //         missingFields.push("PAN");
  //       }
          
  
  //         if (missingFields.length > 0) {
  //           console.warn(
  //             `Row ${index + 2} skipped (missing fields: ${missingFields.join(", ")}):`,
  //             row
  //           );
  //           skippedRows.push({ rowNumber: index + 2, reason: "Missing required fields", missingFields, row });
  //           return;
  //         }
  
          
  //       if (!documentId) {
  //         skippedRows.push({ rowNumber: index + 2, reason: "Could not determine document ID", row });
  //         return;
  //       }

  //       // 🔍 Check for duplicate
  //       const isDuplicate = existingIds.includes(documentId);
  //       if (isDuplicate) {
  //         console.warn(`Row ${index + 2} skipped (duplicate ID: ${documentId}):`, row);
  //         skippedRows.push({ rowNumber: index + 2, reason: "Duplicate document ID", row });
  //         return;
  //       }
  //         const vendor = {
            
            
  //           address: row["address"] || "",
  //           city: row["city"] || "",
  //           pincode: row["pincode"] || "",
  //           contactEmail: row["contactEmail"] || "",
  //           contactPhone: row["contactPhone"] || "",
  //           pan: row["pan"] || "",
  //           tan: row["tan"] || "",
  //           gstin: row["gstin"] || "",
  //           turnover: row["turnover"] || "",
  //           tds: row["tds"] || "",
  //           tcs: row["tcs"] || "",
  //           type: row["type"] || "",
            
  //     vendorType: row["vendorType"] || "",
  //     state: row["state"] || "",
  //     country: row["country"] || "",
  //     contactName:row["contactName"] || "" ,
      
      
  //     msme: row["msme"] || "",
  //     eInvoice: row["eInvoice"] || "",
  //     bankName: row["bankName"] || "",
  //     bankBranch: row["bankBranch"] || "",
  //     bankAccountNo: row["bankAccountNo"] || "",
  //     ifsc: row["ifsc"] || "",
  //     nature: row["nature"] || "",
  //     paymentTerms: row["paymentTerms"] || "",
      
      
      
    
      
      
      
   
      
  //         };
          

  //         mutate.mutate(vendor);
          
  //       });
  //       if (skippedRows.length > 0) {
  //         console.log("⏭️ Skipped Rows Summary:", skippedRows);
  //       }
  //     } catch (error) {
  //       console.error("Import failed:", error);
  //     }
  //   };
  //   reader.readAsArrayBuffer(file);
  // };

  // const handleExport = () => {
  //   const ws = XLSX.utils.json_to_sheet(data);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Vendors");
  //   XLSX.writeFile(wb, "vendors_onboarding.xlsx");
  // };


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

      const vendorCollection = collection(db, "masters/ONBOARDING/VENDOR");
      const existingDocs = await getDocs(vendorCollection);
      const existingIds = existingDocs.docs.map((doc) => doc.id);

      const REQUIRED_FIELDS = ["Contact Name", "Type"];
      const skippedRows = [];

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        const excelRowNum = i + 5;

        // Ensure string values and trim
        const type = (row["Type"] || "B2C").toString().trim().toUpperCase();
        row["Type"] = type;
        row["PAN"] = row["PAN"]?.toString().trim();
        row["GSTIN"] = row["GSTIN"]?.toString().trim();

        const requiredFields = [...REQUIRED_FIELDS];
        if (type === "B2B") requiredFields.push("GSTIN");
        if (type === "B2C") requiredFields.push("PAN");

        const missingFields = requiredFields.filter(
          (field) => !row[field] || String(row[field]).trim() === ""
        );

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
          type === "B2B" ? row["GSTIN"] : type === "B2C" ? row["PAN"] : "";

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

        const vendor = {
          address: row["Address"] || "",
          city: row["City"] || "",
          pincode: row["Pincode"] || "",
          contactEmail: row["Contact Email"] || "",
          contactPhone: row["Contact Phone"] || "",
          pan: row["PAN"] || "",
          tan: row["TAN"] || "",
          gstin: row["GSTIN"] || "",
          turnover: row["Turnover"] || "",
          tds: row["TDS"] || "",
          tcs: row["TCS"] || "",
          type,
          vendorType: row["Vendor Type"] || "",
          state: row["State"] || "",
          country: row["Country"] || "",
          contactName: row["Contact Name"] || "",
          msme: row["MSME"] || "",
          eInvoice: row["e-Invoice"] || "",
          bankName: row["Bank Name"] || "",
          bankBranch: row["Bank Branch"] || "",
          bankAccountNo: row["Account No"] || "",
          ifsc: row["IFSC"] || "",
          nature: row["Nature"] || "",
          paymentTerms: row["Payment Terms"] || "",
        };

        try {
          const vendorRef = doc(db, "masters/ONBOARDING/VENDOR", documentId);
          await setDoc(vendorRef, vendor);
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

  // Define columns
  worksheet.columns = [
    { header: "Vendor Type", key: "vendorType", width: 15 },
    { header: "Contact Name", key: "contactName", width: 20 },
    { header: "Contact Email", key: "contactEmail", width: 25 },
    { header: "Contact Phone", key: "contactPhone", width: 15 },
    { header: "Address", key: "address", width: 25 },
    { header: "City", key: "city", width: 15 },
    { header: "Pincode", key: "pincode", width: 10 },
    { header: "State", key: "state", width: 15 },
    { header: "Country", key: "country", width: 15 },
    { header: "PAN", key: "pan", width: 15 },
    { header: "TAN", key: "tan", width: 15 },
    { header: "GSTIN", key: "gstin", width: 20 },
    { header: "Turnover", key: "turnover", width: 15 },
    { header: "TDS", key: "tds", width: 10 },
    { header: "TCS", key: "tcs", width: 10 },
    { header: "Type", key: "type", width: 12 },
    
    { header: "MSME", key: "msme", width: 10 },
    { header: "e-Invoice", key: "eInvoice", width: 10 },
    { header: "Bank Name", key: "bankName", width: 20 },
    { header: "Bank Branch", key: "bankBranch", width: 20 },
    { header: "Account No", key: "bankAccountNo", width: 20 },
    { header: "IFSC", key: "ifsc", width: 15 },
    { header: "Nature", key: "nature", width: 15 },
    { header: "Payment Terms", key: "paymentTerms", width: 15 },
  ];

  worksheet.spliceRows(1, 0, [], [], []);
  worksheet.getRow(1).height = 75;
  worksheet.getRow(2).height = 30;
  worksheet.getCell('D1').value = title;
  worksheet.getCell('E1').value = 'Generated On: ' + new Date().toLocaleDateString();
  worksheet.getCell('K1').value = 'Powered By';

  const headerColumns = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N','O','P','Q','R','S','T','U','V','W','X'];
  headerColumns.forEach(col => {
    ['1', '2'].forEach(row => {
      const cell = `${col}${row}`;
      worksheet.getCell(cell).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFA0A0A0' }
      };
      worksheet.getCell(cell).font = { bold: true, size: 12 };
    });
  });

  // Logos (optional, reuse same logic)
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

  worksheet.getRow(3).height = 20;

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

  // Fill data
  data.forEach(v => {
    worksheet.addRow({
      vendorType: v.vendorType,
      contactName: v.contactName,
      contactEmail: v.contactEmail,
      contactPhone: v.contactPhone,
      address: v.address,
      city: v.city,
      pincode: v.pincode,
      state: v.state,
      country: v.country,
      pan: v.pan,
      tan: v.tan,
      gstin: v.gstin,
      turnover: v.turnover,
      tds: v.tds,
      tcs: v.tcs,
      type: v.type,
      
      msme: v.msme,
      eInvoice: v.eInvoice,
      bankName: v.bankName,
      bankBranch: v.bankBranch,
      bankAccountNo: v.bankAccountNo,
      ifsc: v.ifsc,
      nature: v.nature,
      paymentTerms: v.paymentTerms,
    });
  });

  // Style rows
  for (let i = 5; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
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

  // Export
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  saveAs(blob, `${title.replace(/\s+/g, '_')}_report.xlsx`);
};

   const handleView = (vendor) => {
  setSelectedVendor(vendor);
  setEditFormData(vendor); // Initialize form data
  setIsEditing(false);
  setModalOpen(true);
};



// Section wrapper
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

// Label formatter (same as you used)
const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/_/g, " ");
};


const handleEdit = (vendor) => {
  setSelectedVendor(vendor);
  setEditFormData(vendor); // Initialize form data
  setIsEditing(true);
  setModalOpen(true);
};
// const handleSave = async () => {
//   try {
//     const documentId = getVendorDocumentId(editFormData);
//         const vendorDocRef = doc(db, "masters", "ONBOARDING", "VENDOR", documentId);
    
//         await updateDoc(vendorDocRef, editFormData);

//     setSelectedVendor(editFormData); // update modal data
//    showSnackbar(`Updated Vendor ${editFormData.contactName} details`, "success");
//      // Invalidate the query to refetch the customers
//     queryClient.invalidateQueries(['vendors']); // React Query refetches the data
//     setModalOpen(false);
    
//   } catch (error) {
//     console.error("Error updating Vendor:", error);
//     showSnackbar("Failed to update vendor.", "error");
//   }

  

  
  
  




// };
  
const handleSave = async () => {
  try {
    const oldDocumentId = getVendorDocumentId(selectedVendor); // before editing
    const newDocumentId = getVendorDocumentId(editFormData); // after editing

    if (!newDocumentId) {
      showSnackbar("Missing document ID (GSTIN/PAN/Aadhar)", "warning");
      return;
    }

    if (oldDocumentId !== newDocumentId) {
      // ID changed → delete old & create new
      const oldDocRef = doc(db, "masters", "ONBOARDING", "VENDOR", oldDocumentId);
      const newDocRef = doc(db, "masters", "ONBOARDING", "VENDOR", newDocumentId);

      // Create new document first to avoid data loss if deletion fails
      await setDoc(newDocRef, editFormData);
      await deleteDoc(oldDocRef);
    } else {
      // ID is same → simple update
      const vendorDocRef = doc(db, "masters", "ONBOARDING", "VENDOR", newDocumentId);
      await updateDoc(vendorDocRef, editFormData);
    }

    setSelectedVendor(editFormData); // update modal data
    showSnackbar(`Updated Vendor ${editFormData.contactName} details`, "success");
    queryClient.invalidateQueries(['vendors']);
    setModalOpen(false);

  } catch (error) {
    console.error("Error updating Vendor:", error);
    showSnackbar("Failed to update vendor.", "error");
  }
};


return (
    <div className=" space-y-6 bg-white shadow rounded-lg w-[75vw] h-auto flex flex-col justify-center items-center gap-4 " style={{padding:'12px'}}>
      <GlobalTextFieldHoverStyle/>
        <div className="w-[95%] flex justify-between items-center" style={{padding:'4px'}}>
          <div className="flex justify-start items-center gap-2"><h1 className="text-3xl text-black font-bold">Vendors</h1>
          <div className="w-[95%]  relative">
            {/* Filter Icon */}
              <div className="absolute inset-y-0 left-0  flex items-center pointer-events-none" style={{padding:'4px'}}>
                <FilterListIcon className="text-gray-500" fontSize="small" />
              </div>
  <select
    value={selectedType}
    onChange={(e) => {
      setSelectedType(e.target.value);
      setCurrentPage(1);
    }}
   className="  w-full rounded-md border border-gray-300 bg-white text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005899]"
    style={{padding:'2px 2px 2px 20px'}}>
    {["All","B2B","B2C"].map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </select>
</div>
</div>
        <Link to={"/Vendor"} className="text-sm bg-black text-white rounded-lg" style={{padding:'4px'}} ><PersonAddIcon/> &nbsp;Create New Vendor</Link></div>
      <div className="flex justify-between items-center  w-[95%]">
        {/* <div className="flex flex-col w-1/3">
          <label htmlFor="search" className=" text-gray-700">Search</label>
          <input
            id="search"
            className="border   rounded-lg w-full h-8"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div> */}
         <div className="flex flex-col w-1/3 ">
                 <div className="relative w-full">
          <span className="absolute inset-y-0 left-0  flex items-center pointer-events-none text-gray-500">
            <SearchIcon fontSize="small" />
          </span>
          <input
        
            type="text"
            id="search"
            className="border  rounded-lg w-[90%] h-8 hover:border-[#005899] focus:outline-none"
            placeholder="Search Vendors..."
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
          <button onClick={downloadTemplate} className="border   rounded-lg cursor-pointer bg-[#005899] text-white flex items-center" style={{padding:'6px'}}>
      <DownloadOutlinedIcon />Download Upload Template
    </button>
          <label className="border   rounded-lg cursor-pointer bg-black text-white flex items-center" style={{padding:'6px'}}>
            <UploadOutlinedIcon/>Import
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <button
            className="border   rounded-lg bg-black text-white"
            onClick={() => handleExport("Vendor Report")} // Pass the function reference correctly
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
          <table className="  rounded-lg overflow-hidden w-[100%] text-sm border border-black" >
            <thead className="bg-[#e6f0f7]  " >
              <tr className="h-8" >
               
                <th className="  text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Contact Name</th>
                <th className="  text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Contact Email</th>
                <th className="  text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Document ID</th>
                       <th className="  text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Vendor Type</th>
                <th className="  text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Business Type</th>
                <th className="  text-right text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Actions</th>
              </tr>
            </thead>
            <tbody >
              {currentRecords.map((vendor) => (
                <tr key={vendor.id} className="border border-black hover:bg-gray-50 h-8" >
                  
                  <td className=" " style={{padding:'4px'}}>{vendor.contactName}</td>
                  <td className=" " style={{padding:'4px'}}>{vendor.contactEmail}</td>
                  <td className=" " style={{padding:'4px'}}>{getVendorDocumentId(vendor)}</td>
                  
        {/* Type with Badge */}
        <td className=" " style={{ padding: '4px' }}>
          {vendor.type === "B2B" && (
            <span className="inline-flex items-center justify-center   text-xs font-medium rounded-full bg-sky-100 text-sky-600" style={{padding:'2px 4px'}}>
              B2B
            </span>
          )}
          {vendor.type === "B2C" && (
            <span className="inline-flex items-center justify-center   text-xs font-medium rounded-full bg-blue-100 text-blue-600" style={{padding:'2px 4px'}}>
              B2C
            </span>
          )}
        </td>

                  <td className=" " style={{padding:'4px'}}>{vendor.vendorType}</td>
                  <td className="  text-right" style={{padding:'4px'}}>
                    <button
                      className="border   rounded-md text-[#005899] border-white hover:border-[#005899] bg-white  "
                      onClick={() => {
                        handleView(vendor)
                        setSelectedVendor(vendor);
                        setIsEditing(false);  // Start with viewing mode
                        setModalOpen(true);
                      }}
                      style={{padding:'4px'}}
                    > 
                      <VisibilityOutlinedIcon/>
                    </button>
                  
                    <button
                      className="border   rounded-md text-[#005899] border-white hover:border-[#005899] bg-white   "
                      onClick={() => {
                        handleEdit(vendor)
                        
                        setSelectedVendor(vendor);
                        setIsEditing(true);  // Start with edit mode
                        setModalOpen(true);
                      }}
                      style={{padding:'4px'}}
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

      {/* Add vendor Form*/ }
      

      {/* Modal */}
 {modalOpen && selectedVendor && editFormData && (
  <div className="fixed inset-0 flex items-center justify-center z-50" style={{
    backgroundColor: "rgba(0, 0,0, 0.4)", // change alpha for more/less dim
    
  }}>
    <div className="rounded-lg shadow-xl max-w-2xl w-full relative" >

      {/* Header */}
      <div className="flex justify-between items-center  h-16 bg-[#0b80d3] rounded-t-lg" style={{ padding: '10px' }}>
        <span className="flex gap-4 items-center">
          <h2 className="text-2xl text-white font-bold flex-grow">
            {isEditing ? "Edit Vendor Details" : "Vendor Details"}
          </h2>
          {!isEditing && (
            <button
              className="border   rounded-md text-[#005899] border-white hover:border-[#005899] bg-white "
              onClick={() => setIsEditing(true)}
              style={{ padding: '4px' }}
            >
              <EditOutlinedIcon />
            </button>
          )}
        </span>

        {isEditing ? (
          <button
            onClick={() => {
              setOnConfirm(() => async () => {
                const documentId = editFormData.gstin?.trim() || editFormData.pan?.trim();
                if (!documentId) {
                  showSnackbar("Missing document ID", "warning");
                  return;
                }

                try {
                  const vendorDocRef = doc(db, "masters", "ONBOARDING", "VENDOR", documentId);
                  await deleteDoc(vendorDocRef);
                  showSnackbar(`Vendor ${editFormData.contactName} deleted successfully.`, "success");
                  queryClient.invalidateQueries(["vendors"]);
                  setModalOpen(false);
                } catch (error) {
                  console.error("Delete failed:", error);
                  showSnackbar("Failed to delete vendor.", "error");
                } finally {
                  setConfirmOpen(false);
                }
              });
              setConfirmOpen(true);
            }}
          >
            <span className="flex justify-center items-center text-white bg-red-600 hover:bg-red-800 font-semibold" style={{ padding: '2px 4px', borderRadius: '4px' }}>
              Delete Vendor&nbsp;<DeleteIcon />
            </span>
          </button>
        ) : <div />}
        {!isEditing && (
          <button className="text-gray-500 hover:text-black font-semibold" onClick={() => setModalOpen(false)}>
            <CloseIcon style={{ backgroundColor: 'red', color: 'white' }} />
          </button>
        )}
      </div>

      {/* BODY */}
      {isEditing ? (
        <div className="space-y-6 max-h-[80vh] overflow-auto bg-white " style={{ padding: '10px' }}>
          <GlobalTextFieldHoverStyle />

          {/* Vendor Details */}
          <div className="border-2 border-blue-200 rounded-lg " style={{ margin: '6px 0px' }}>
            <h3 className="text-md font-semibold text-black  h-8 flex items-center bg-blue-200 rounded-t-lg" style={{ padding: '6px' }}>
              Vendor Details&nbsp;<BusinessCenterIcon/>
            </h3>
            <div className="grid grid-cols-2 gap-4" style={{ padding: '10px' }}>
              {[
                { name: "vendorType", label: "Vendor Type" },
                { name: "type", label: "Vendor Category", isSelect: true, options: ["B2B", "B2C"] },
                { name: "nature", label: "Nature" },
                { name: "paymentTerms", label: "Payment Terms" },
              ].map((field) => (
                <TextField
                  key={field.name}
                  size="small"
                  fullWidth
                  select={field.isSelect}
                  label={field.label}
                  value={editFormData[field.name] || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, [field.name]: e.target.value })
                  }
                >
                  {field.isSelect &&
                    field.options.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                </TextField>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="border-2 border-blue-200 rounded-lg " style={{ margin: '6px 0px' }}>
            <h3 className="text-md font-semibold text-black  h-8 flex items-center bg-blue-200 rounded-t-lg" style={{ padding: '6px' }}>
              Contact Details&nbsp;<PersonIcon/>
            </h3>
            <div className="grid grid-cols-2 gap-4" style={{ padding: '10px' }}>
              {[
                { name: "contactName", label: "Contact Name" },
                { name: "contactPhone", label: "Contact Phone" },
                { name: "contactEmail", label: "Contact Email" },
              ].map((field) => (
                <TextField
                  key={field.name}
                  size="small"
                  fullWidth
                  label={field.label}
                  value={editFormData[field.name] || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, [field.name]: e.target.value })
                  }
                />
              ))}
            </div>
          </div>

          {/* Address Details */}
          <div className="border-2 border-blue-200 rounded-lg " style={{ margin: '6px 0px' }}>
            <h3 className="text-md font-semibold text-black  h-8 flex items-center bg-blue-200 rounded-t-lg" style={{ padding: '6px' }}>
              Address Details&nbsp;<LocationOnIcon />
            </h3>
            <div className="grid grid-cols-2 gap-4" style={{ padding: '10px' }}>
              {[
                { name: "address", label: "Address" },
                { name: "city", label: "City" },
                { name: "state", label: "State" },
                { name: "country", label: "Country" },
                { name: "pincode", label: "Pincode" },
              ].map((field) => (
                <TextField
                  key={field.name}
                  size="small"
                  fullWidth
                  label={field.label}
                  value={editFormData[field.name] || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, [field.name]: e.target.value })
                  }
                />
              ))}
            </div>
          </div>

          {/* Bank Details */}
          <div className="border-2 border-blue-200 rounded-lg " style={{ margin: '6px 0px' }}>
            <h3 className="text-md font-semibold text-black  h-8 flex items-center bg-blue-200 rounded-t-lg" style={{ padding: '6px' }}>
              Bank Details&nbsp;<CreditCardIcon/>
            </h3>
            <div className="grid grid-cols-2 gap-4" style={{ padding: '10px' }}>
              {[
                { name: "bankName", label: "Bank Name" },
                { name: "bankBranch", label: "Bank Branch" },
                { name: "bankAccountNo", label: "Account Number" },
                { name: "ifsc", label: "IFSC Code" },
              ].map((field) => (
                <TextField
                  key={field.name}
                  size="small"
                  fullWidth
                  label={field.label}
                  value={editFormData[field.name] || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, [field.name]: e.target.value })
                  }
                />
              ))}
            </div>
          </div>

          {/* Statutory & Financial Info */}
          <div className="border-2 border-blue-200 rounded-lg " style={{ margin: '6px 0px' }}>
            <h3 className="text-md font-semibold text-black  h-8 flex items-center bg-blue-200 rounded-t-lg" style={{ padding: '6px' }}>
              Statutory & Financial Info&nbsp;<AccountBalanceIcon/>
            </h3>
            <div className="grid grid-cols-2 gap-4" style={{ padding: '10px' }}>
              {[
                { name: "gstin", label: "GSTIN" },
                { name: "pan", label: "PAN" },
                { name: "tan", label: "TAN" },
                { name: "tds", label: "TDS" },
                { name: "tcs", label: "TCS" },
                { name: "turnover", label: "Turnover" },
              ].map((field) => (
                <TextField
                  key={field.name}
                  size="small"
                  fullWidth
                  label={field.label}
                  value={editFormData[field.name] || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, [field.name]: e.target.value })
                  }
                />
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-2 border-blue-200 rounded-lg " style={{ margin: '6px 0px' }}>
            <h3 className="text-md font-semibold text-black  h-8 flex items-center bg-blue-200 rounded-t-lg" style={{ padding: '6px' }}>
              Additional Info&nbsp;<NotesIcon />
            </h3>
            <div className="grid grid-cols-2 gap-4" style={{ padding: '10px' }}>
              {[
                { name: "msme", label: "MSME" },
                { name: "eInvoice", label: "E-Invoice Applicable" },
              ].map((field) => (
                <TextField
                  key={field.name}
                  size="small"
                  fullWidth
                  label={field.label}
                  value={editFormData[field.name] || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, [field.name]: e.target.value })
                  }
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        // View Mode Layout
        <div className="space-y-6 max-h-[80vh] overflow-auto bg-white  rounded-b-lg" style={{ padding: '10px' }}>
          <Section  title={
      <div className="flex items-center gap-2">
        <span>Vendor Details</span>
        <BusinessCenterIcon style={{ fontSize: 20 }} />
      </div>
    }>
            <Field label="Vendor Type" value={selectedVendor?.vendorType} />
            <Field label="Vendor Category" value={selectedVendor?.type} />
            <Field label="Nature" value={selectedVendor?.nature} />
            <Field label="Payment Terms" value={selectedVendor?.paymentTerms} />
          </Section>

          <Section  title={
      <div className="flex items-center gap-2 ">
        <span>Contact Details</span>
        <PersonIcon style={{ fontSize: 20 }} />
        
      </div>
    }>
            <Field label="Contact Name" value={selectedVendor?.contactName} />
            <Field label="Phone" value={selectedVendor?.contactPhone} />
            <Field label="Email" value={selectedVendor?.contactEmail} />
          </Section>

          <Section  title={
      <div className="flex items-center gap-2 ">
        <span>Address Details</span>
        <LocationOnIcon style={{ fontSize: 20 }} />
        
      </div>
    }>
            <Field label="Address" value={selectedVendor?.address} />
            <Field label="City" value={selectedVendor?.city} />
            <Field label="State" value={selectedVendor?.state} />
            <Field label="Country" value={selectedVendor?.country} />
            <Field label="Pincode" value={selectedVendor?.pincode} />
          </Section>

          <Section  title={
      <div className="flex items-center gap-2 ">
        <span>Bank Details</span>
        <CreditCardIcon style={{ fontSize: 20 }} />
        
      </div>
    }>
            <Field label="Bank Name" value={selectedVendor?.bankName} />
            <Field label="Branch" value={selectedVendor?.bankBranch} />
            <Field label="Account No" value={selectedVendor?.bankAccountNo} />
            <Field label="IFSC" value={selectedVendor?.ifsc} />
          </Section>

          <Section  title={
      <div className="flex items-center gap-2 ">
        <span>Statutory & Financial Informtion</span>
        <AccountBalanceIcon style={{ fontSize: 20 }} />
        
      </div>
    }>
            <Field label="GSTIN" value={selectedVendor?.gstin} />
            <Field label="PAN" value={selectedVendor?.pan} />
            <Field label="TAN" value={selectedVendor?.tan} />
            <Field label="TDS" value={selectedVendor?.tds} />
            <Field label="TCS" value={selectedVendor?.tcs} />
            <Field label="Turnover" value={selectedVendor?.turnover} />
          </Section>

          <Section title={
      <div className="flex items-center gap-2 ">
        <span>Additional Information</span>
        <NotesIcon style={{ fontSize: 20 }} />
        
      </div>
    }>
            <Field
  label="MSME "
  value={selectedVendor?.msme === true ? "Yes" : "No"}
/>

<Field
  label="E-Invoice Applicable"
  value={selectedVendor?.eInvoice === true ? "Yes" : "No"}
/>

          </Section>
        </div>
      )}

      {/* Action Buttons */}
      {isEditing && (
        <div className=" flex justify-end gap-3 h-10 items-end bg-white rounded-b-lg" style={{ padding: '10px' }}>
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
          <button
            className="bg-green-600 text-white rounded hover:bg-green-500"
            style={{ padding: '2px 4px' }}
            onClick={handleSave}
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
  <DialogContent>Are you sure you want to delete this Vendor?</DialogContent>
  <DialogActions>
    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
    <Button onClick={() => onConfirm()} color="error" variant="contained">Delete</Button>
  </DialogActions>
</Dialog>


    </div>
  );
}

