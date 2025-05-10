// // import { useState, useEffect } from "react";
// // import { Button } from "../ui/Button";
// // import { Table, TableBody, TableCell, TableHead, TableRow } from "../ui/Table";
// // import { Label } from "../ui/Label";
// // import { Input } from "../ui/Input";
// // import { db } from "../Firebase/firebase";
// // import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

// // // Fetch customers from Firestore
// // const fetchCustomersFromFirestore = async () => {
// //   const customersCollection = collection(db, "customers");
// //   const snapshot = await getDocs(customersCollection);
// //   return snapshot.docs.map((doc) => ({
// //     ...doc.data(),
// //     id: doc.id,
// //   }));
// // };

// // export function CustomerTable() {
// //   const [customers, setCustomers] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [selectedCustomer, setSelectedCustomer] = useState(null);

// //   useEffect(() => {
// //     fetchCustomersFromFirestore().then((data) => setCustomers(data));
// //   }, []);

// //   const handleSearchChange = (e) => {
// //     setSearchTerm(e.target.value);
// //   };

// //   const handleAddNewCustomer = () => {
// //     setSelectedCustomer(null);
// //     setIsModalOpen(true);
// //   };

// //   const handleEditCustomer = (customer) => {
// //     setSelectedCustomer(customer);
// //     setIsModalOpen(true);
// //   };

// //   const deleteCustomerById = async (customerId) => {
// //     await deleteDoc(doc(db, "customers", customerId));
// //     const updatedCustomers = customers.filter((c) => c.id !== customerId);
// //     setCustomers(updatedCustomers);
// //   };

// //   const filteredCustomers = customers.filter((customer) =>
// //     customer.name.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   return (
// //     <div>
// //       <div className="flex justify-between items-center mb-4">
// //         <h2 className="text-xl font-bold">Customers</h2>
// //         <Button onClick={handleAddNewCustomer}>Add New Customer</Button>
// //       </div>

// //       <div className="mb-4">
// //         <Label htmlFor="search">Search Customers</Label>
// //         <Input
// //           id="search"
// //           placeholder="Search by name"
// //           value={searchTerm}
// //           onChange={handleSearchChange}
// //         />
// //       </div>

// //       <Table>
// //         <TableHead>
// //           <TableRow>
// //             <TableCell>Code</TableCell>
// //             <TableCell>Name</TableCell>
// //             <TableCell>Email</TableCell>
// //             <TableCell>Phone</TableCell>
// //             <TableCell>Actions</TableCell>
// //           </TableRow>
// //         </TableHead>
// //         <TableBody>
// //           {filteredCustomers.map((customer) => (
// //             <TableRow key={customer.id}>
// //               <TableCell>{customer.code}</TableCell>
// //               <TableCell>{customer.name}</TableCell>
// //               <TableCell>{customer.email}</TableCell>
// //               <TableCell>{customer.phone}</TableCell>
// //               <TableCell>
// //                 <Button variant="outline" onClick={() => handleEditCustomer(customer)}>
// //                   Edit
// //                 </Button>
// //                 <Button
// //                   variant="destructive"
// //                   onClick={() => deleteCustomerById(customer.id)}
// //                   className="ml-2"
// //                 >
// //                   Delete
// //                 </Button>
// //               </TableCell>
// //             </TableRow>
// //           ))}
// //         </TableBody>
// //       </Table>

// //       {/* Uncomment this when your modal is ready */}
// //       {/* <CustomerOnboardingModal
// //         isOpen={isModalOpen}
// //         onClose={() => setIsModalOpen(false)}
// //         customer={selectedCustomer}
// //         refetch={() => fetchCustomersFromFirestore().then((data) => setCustomers(data))}
// //       /> */}
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import * as XLSX from "xlsx";
// import { db } from "../Firebase/firebase"; // Adjust path as needed
// import { addDoc, collection,doc,getDoc,getDocs } from "firebase/firestore";

// const RECORDS_PER_PAGE = 10;


  

// export function CustomerTable() {
    
  
 
//   const queryClient = useQueryClient();
//   const demo = async () => {
//     try {
//       const docRef = doc(db, "masters", "ONBOARDING", "CUSTOMER", "43");
      
//       // Await the result of getDoc
//       const docSnap = await getDoc(docRef);
      
//       if (docSnap.exists()) {
//         console.log("data:", docSnap.data());
//       } else {
//         console.log("No such document!");
//       }
//     } catch (error) {
//       console.error("Error fetching document:", error);
//     }
//   };
  
//   demo();
  
  
  

//   // Fetch customers
//   const fetchCustomers = async () => {
//     try {
//         const customersCollection = collection(db, "masters/ONBOARDING/CUSTOMER");

//       const snapshot = await getDocs(customersCollection);
//       console.log("snap");  // This should log if the data is fetched
  
//       return snapshot.docs.map((doc) => ({
//         ...doc.data(),
//         id: doc.id,
//       }));
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//     }
//   };
  

// //   const { data = [], isLoading, isError, refetch } = useQuery({
// //     queryKey: ["customers"],
// //     queryFn: fetchCustomers,
// //   });
// const { data = [], isLoading, isError, error } = useQuery({
//     queryKey: ['customers'],
//     queryFn: fetchCustomers,
//   });
  
  
//   console.log("Data:", data);
//   console.log("Is Loading:", isLoading);
//   console.log("Is Error:", isError);
//   console.log("Error:", error);
//   const addCustomer = async (customer) => {
//     const customersCollection = collection(db, "masters/ONBOARDING/CUSTOMER");
//     await addDoc(customersCollection, customer);
//   };
  
  
  

//   // Add/update customer
// //   const mutate = useMutation({
// //     mutationFn: fetchCustomers,  // Your mutation function
// //     onSuccess: (data) => {
// //       console.log("Data submitted successfully", data);
// //       // Handle post-mutation logic
// //     },
// //     onError: (error) => {
// //       console.error("Error during mutation", error);
// //     }
// //   });
// const mutate = useMutation({
//     mutationFn: addCustomer,
//     onSuccess: () => {
//       console.log("Customer added successfully");
//       queryClient.invalidateQueries(['customers']); // refetch after add
//     },
//     onError: (error) => {
//       console.error("Error adding customer", error);
//     }
//   });
  
  

//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);

//   const filteredCustomers = data.filter(
//     (customer) =>
//       customer.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customer.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalPages = Math.ceil(filteredCustomers.length / RECORDS_PER_PAGE);
//   const currentRecords = filteredCustomers.slice(
//     (currentPage - 1) * RECORDS_PER_PAGE,
//     currentPage * RECORDS_PER_PAGE
//   );

//   const handleFileUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = async (event) => {
//       try {
//         const data = new Uint8Array(event.target.result);
//         const workbook = XLSX.read(data, { type: "array" });
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const jsonData = XLSX.utils.sheet_to_json(sheet);

//         jsonData.forEach((row) => {
//           const customer = {
//             code: row["code"] || "",
//             name: row["name"] || "",
//             address: row["address"] || "",
//             city: row["city"] || "",
//             pincode: row["pincode"] || "",
//             email: row["email"] || "",
//             phone: row["phone"] || "",
//             pan: row["pan"] || "",
//             tan: row["tan"] || "",
//             gstin: row["gstin"] || "",
//             turnover: row["turnover"] || "",
//             tds: row["tds"] || "",
//             tcs: row["tcs"] || "",
//             status: row["status"] || "Pending",
//           };
//           mutate.mutate(customer);

//         });
//       } catch (error) {
//         console.error("Import failed:", error);
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const handleExport = () => {
//     const ws = XLSX.utils.json_to_sheet(data);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Customers");
//     XLSX.writeFile(wb, "customers_onboarding.xlsx");
//   };

//   const handleView = (customer) => {
//     setSelectedCustomer(customer);
//     setModalOpen(true);
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <div className="flex justify-between items-end">
//         <div className="flex flex-col w-1/2">
//           <label htmlFor="search" className="mb-1 font-medium">Search</label>
//           <input
//             id="search"
//             className="border p-2 rounded"
//             placeholder="Search customers..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//           />
//         </div>
//         <div className="flex space-x-2">
//           <label className="border px-4 py-2 rounded cursor-pointer bg-white hover:bg-gray-100 flex items-center">
//             Import
//             <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
//           </label>
//           <button
//             className="border px-4 py-2 rounded bg-white hover:bg-gray-100"
//             onClick={handleExport}
//           >
//             Export
//           </button>
//         </div>
//       </div>

//       {isLoading ? (
//         <p>Loading records...</p>
//       ) : isError ? (
//         <p>Error loading records.</p>
//       ) : currentRecords.length > 0 ? (
//         <>
//           <table className="min-w-full border rounded">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-4 py-2 text-left">Code</th>
//                 <th className="px-4 py-2 text-left">Name</th>
//                 <th className="px-4 py-2 text-left">Email</th>
//                 <th className="px-4 py-2 text-left">GSTN</th>
//                 <th className="px-4 py-2 text-left">Status</th>
//                 <th className="px-4 py-2 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentRecords.map((customer) => (
//                 <tr key={customer.id} className="border-t">
//                   <td className="px-4 py-2">{customer.code}</td>
//                   <td className="px-4 py-2">{customer.name}</td>
//                   <td className="px-4 py-2">{customer.email}</td>
//                   <td className="px-4 py-2">{customer.gstin}</td>
//                   <td className="px-4 py-2">{customer.status}</td>
//                   <td className="px-4 py-2 text-right">
//                     <button
//                       className="border px-3 py-1 rounded hover:bg-gray-100"
//                       onClick={() => handleView(customer)}
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className="flex justify-end items-center space-x-2 mt-4">
//             <button
//               className="border px-3 py-1 rounded disabled:opacity-50"
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </button>
//             <span>
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               className="border px-3 py-1 rounded disabled:opacity-50"
//               onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </button>
//           </div>
//         </>
//       ) : (
//         <p>No records found.</p>
//       )}

//       {/* Modal */}
//       {modalOpen && selectedCustomer && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow max-w-lg w-full relative">
//             <h2 className="text-lg font-bold mb-4">Customer Details</h2>
//             <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
//               {JSON.stringify(selectedCustomer, null, 2)}
//             </pre>
//             <button
//               className="mt-4 border px-4 py-2 rounded bg-white hover:bg-gray-100"
//               onClick={() => setModalOpen(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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

export function CustomerTable() {
  const queryClient = useQueryClient();
  
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

  // const addCustomer = async (customer) => {
  //   const customersCollection = collection(db, "masters/ONBOARDING/CUSTOMER");
  //   await addDoc(customersCollection, customer);
  // };
  const addCustomer = async (customer) => {
    const customersCollection = collection(db, "masters/ONBOARDING/CUSTOMER");
  
    // Use setDoc() to set the document with PAN as the document ID
    const customerDocRef = doc(customersCollection, customer.pan); // Set the document ID as PAN
    await setDoc(customerDocRef, customer);  // Store the customer data with the PAN as the document ID
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

  const filteredCustomers = data.filter(
    (customer) =>
      
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
  
  //       const REQUIRED_FIELDS = ["pan", "name", "email", "phone", "address", "city"];
  //       const skippedRows = [];
  
  //       jsonData.forEach((row, index) => {
  //         const missingFields = REQUIRED_FIELDS.filter(
  //           (field) => !row[field] || String(row[field]).trim() === ""
  //         );
  
  //         if (missingFields.length === 0) {
  //           // ✅ all required fields are present → upload
  //           const customer = {
  //             name: row["name"],
  //             address: row["address"],
  //             city: row["city"],
  //             pincode: row["pincode"] || "",
  //             email: row["email"],
  //             phone: row["phone"],
  //             pan: row["pan"],
  //             tan: row["tan"] || "",
  //             gstin: row["gstin"] || "",
  //             turnover: row["turnover"] || "",
  //             tds: row["tds"] || "",
  //             tcs: row["tcs"] || "",
  //             status: row["status"] || "Pending",
  //           };
  //           mutate.mutate(customer);
  //         } else {
  //           // ❌ missing required fields → skip & log
  //           console.warn(
  //             `Row ${index + 2} skipped (missing fields: ${missingFields.join(", ")}):`,
  //             row
  //           );
  //           skippedRows.push({ rowNumber: index + 2, missingFields, row });
  //         }
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
  
        // 🔥 STEP 1: fetch existing customers
        const customersCollection = collection(db, "masters/ONBOARDING/CUSTOMER");
        const snapshot = await getDocs(customersCollection);
        const existingCustomers = snapshot.docs.map(doc => doc.data());
  
        const REQUIRED_FIELDS = ["pan", "name", "email", "phone", "address", "city"];
        const skippedRows = [];
  
        jsonData.forEach((row, index) => {
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
  
          const duplicate = existingCustomers.find(
            (cust) =>
              cust.pan?.toLowerCase() === row["pan"]?.toLowerCase() 
          );
  
          if (duplicate) {
            console.warn(
              `Row ${index + 2} skipped (duplicate PAN or email):`,
              row
            );
            skippedRows.push({ rowNumber: index + 2, reason: "Duplicate PAN or email", row });
            return;
          }
  
          // ✅ all checks passed → add customer
          const customer = {
            name: row["name"],
            address: row["address"],
            city: row["city"],
            pincode: row["pincode"] || "",
            email: row["email"],
            phone: row["phone"],
            pan: row["pan"],
            tan: row["tan"] || "",
            gstin: row["gstin"] || "",
            turnover: row["turnover"] || "",
            tds: row["tds"] || "",
            tcs: row["tcs"] || "",
            status: row["status"] || "Pending",
          };
  
          mutate.mutate(customer);
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
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, "customers_onboarding.xlsx");
  };

  const handleView = (customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-white shadow rounded-lg w-[75vw] h-auto flex flex-col justify-center items-center gap-4 " style={{padding:'12px'}}>
        <div className="w-[95%] flex justify-between items-center" style={{padding:'4px'}}><h1 className="text-3xl text-black font-bold">Customers</h1><Link to={"/New-customer"} className="text-sm bg-black text-white rounded-lg" style={{padding:'4px'}} ><PersonAddIcon/> &nbsp;Create New Customer</Link></div>
      <div className="flex justify-between items-center mb-4 w-[95%]">
        <div className="flex flex-col w-1/3">
          <label htmlFor="search" className="mb-1 text-gray-700">Search</label>
          <input
            id="search"
            className="border px-2 py-1 rounded-lg w-full h-8"
            placeholder="Search customers..."
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
               
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>PAN</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>GSTIN</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Status</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Actions</th>
              </tr>
            </thead>
            <tbody >
              {currentRecords.map((customer) => (
                <tr key={customer.id} className="border border-black hover:bg-gray-50 h-8 p-2" >
                  
                  <td className="px-4 py-2" style={{padding:'4px'}}>{customer.name}</td>
                  <td className="px-4 py-2" style={{padding:'4px'}}>{customer.email}</td>
                  <td className="px-4 py-2" style={{padding:'4px'}}>{customer.pan}</td>
                  <td className="px-4 py-2" style={{padding:'4px'}}>{customer.gstin}</td>
                  <td className="px-4 py-2" style={{padding:'4px'}}>{customer.status}</td>
                  <td className="px-4 py-2 text-right " style={{padding:'4px'}}>
                    <button
                      className="border px-3 py-1 rounded-md text-white hover:text-[#005899] hover:border-[#005899] hover:bg-white bg-[#005899] "
                      onClick={() => handleView(customer)}
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

      {/* Add Customer Form*/ }
      

      {/* Modal */}
      {modalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow max-w-lg w-full relative">
            <h2 className="text-lg font-bold mb-4">Customer Details</h2>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(selectedCustomer, null, 2)}
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

