

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { db } from "../Firebase/firebase";
import { addDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link } from "react-router-dom";



const RECORDS_PER_PAGE = 10;

export function VendorTable() {
  const queryClient = useQueryClient();
  
  
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
    const vendorDocRef = doc(vendorsCollection, vendor.gstin); // Set the document ID as GSTIN
        await setDoc(vendorDocRef, vendor);  // Store the customer data with the GSTIN as the document ID
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

  const filteredVendors = data.filter(
    (vendor) =>
    
    vendor.vendorType?.toLowerCase().includes(searchTerm.toLowerCase())||
      vendor.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.gstin?.toLowerCase().includes(searchTerm.toLowerCase())

  );

  const totalPages = Math.ceil(filteredVendors.length / RECORDS_PER_PAGE);
  const currentRecords = filteredVendors.slice(
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
        // 🔥 STEP 1: fetch existing Vendors
                const vendorsCollection = collection(db, "masters/ONBOARDING/VENDOR");
                const snapshot = await getDocs(vendorsCollection);
                const existingVendors = snapshot.docs.map(doc => doc.data());
          
                const REQUIRED_FIELDS = ["pan", "contactName","gstin","vendorType"];
                const skippedRows = [];
          

        jsonData.forEach((row,index) => {
            console.log(`Processing row ${index + 2}`, row);
          const missingFields = REQUIRED_FIELDS.filter(
            (field) => !row[field] || String(row[field]).trim() === ""
          );
          
  
          if (missingFields.length > 0) {
            console.warn(
              `Row ${index + 2} skipped (missing fields: ${missingFields.join(", ")}):`,
              row
            );
            skippedRows.push({ rowNumber: index + 2, reason: "Missing required fields", missingFields, row });
            return;
          }
  
          const duplicate = existingVendors.find(
            (ven) =>
              ven.gstin?.toLowerCase() === row["gstin"]?.toLowerCase() 
          );
  
          if (duplicate) {
            console.warn(
              `Row ${index + 2} skipped (GSTIN already exists):`,
              row
            );
            skippedRows.push({ rowNumber: index + 2, reason: "Duplicate Data", row });
            return;
          }
          const vendor = {
            
            
            address: row["address"] || "",
            city: row["city"] || "",
            pincode: row["pincode"] || "",
            contactEmail: row["contactEmail"] || "",
            contactPhone: row["contactPhone"] || "",
            pan: row["pan"] || "",
            tan: row["tan"] || "",
            gstin: row["gstin"] || "",
            turnover: row["turnover"] || "",
            tds: row["tds"] || "",
            tcs: row["tcs"] || "",
            
      vendorType: row["vendorType"] || "",
      state: row["state"] || "",
      country: row["country"] || "",
      contactName:row["contactName"] || "" ,
      
      
      msme: row["msme"] || "",
      eInvoice: row["eInvoice"] || "",
      bankName: row["bankName"] || "",
      bankBranch: row["bankBranch"] || "",
      bankAccountNo: row["bankAccountNo"] || "",
      ifsc: row["ifsc"] || "",
      nature: row["nature"] || "",
      paymentTerms: row["paymentTerms"] || "",
      
      
      
    
      
      
      
   
      
          };
          mutate.mutate(vendor);
          
        });
        if (skippedRows.length > 0) {
          console.log("⏭️ Skipped Rows Summary:", skippedRows);
        }
      } catch (error) {
        console.error("Import failed:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vendors");
    XLSX.writeFile(wb, "vendors_onboarding.xlsx");
  };

  const handleView = (vendor) => {
    setSelectedVendor(vendor);
    setModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-white shadow rounded-lg w-[75vw] h-auto flex flex-col justify-center items-center gap-4 " style={{padding:'12px'}}>
        <div className="w-[95%] flex justify-between items-center" style={{padding:'4px'}}><h1 className="text-3xl text-black font-bold">Vendors</h1><Link to={"/Vendor"} className="text-sm bg-black text-white rounded-lg" style={{padding:'4px'}} ><PersonAddIcon/> &nbsp;Create New Vendor</Link></div>
      <div className="flex justify-between items-center mb-4 w-[95%]">
        <div className="flex flex-col w-1/3">
          <label htmlFor="search" className="mb-1 text-gray-700">Search</label>
          <input
            id="search"
            className="border px-2 py-1 rounded-lg w-full h-8"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex   gap-2 text-sm">
          <label className="border px-4 py-2 rounded-lg cursor-pointer bg-black text-white flex items-center" style={{padding:'6px'}}>
            <FileUploadIcon/>Import
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <button
            className="border px-4 py-2 rounded-lg bg-black text-white "
            onClick={handleExport}
            style={{padding:'6px'}}
          >
           <FileDownloadIcon/> Export
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
            <thead className="bg-gray-100 px-2" >
              <tr className="h-8" >
               
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Contact Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Contact Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>GSTIN</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Vendor Type</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Actions</th>
              </tr>
            </thead>
            <tbody >
              {currentRecords.map((vendor) => (
                <tr key={vendor.id} className="border border-black hover:bg-gray-50 h-8 p-2" >
                  
                  <td className="px-4 py-2" style={{padding:'4px'}}>{vendor.contactName}</td>
                  <td className="px-4 py-2" style={{padding:'4px'}}>{vendor.contactEmail}</td>
                  <td className="px-4 py-2" style={{padding:'4px'}}>{vendor.gstin}</td>
                  <td className="px-4 py-2" style={{padding:'4px'}}>{vendor.vendorType}</td>
                  <td className="px-4 py-2 text-right " style={{padding:'4px'}}>
                    <button
                      className="border px-3 py-1 rounded-md text-white hover:text-[#005899] hover:border-[#005899] hover:bg-white bg-[#005899] "
                      onClick={() => handleView(vendor)}
                      style={{padding:'4px'}}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div className="flex justify-end items-center gap-2 mt-4">
            <button
              className="border text-white bg-black rounded-md disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{padding:'4px'}}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="border  bg-black text-white rounded-md disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{padding:'4px'}}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No records found.</p>
      )}

      {/* Add vendor Form*/ }
      

      {/* Modal */}
      {modalOpen && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow max-w-lg w-full relative">
            <h2 className="text-lg font-bold mb-4">Vendor Details</h2>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(selectedVendor, null, 2)}
            </pre>
            <button
              className="mt-4 border px-4 py-2 rounded-lg bg-white hover:bg-gray-100"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

