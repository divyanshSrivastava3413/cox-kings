import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { db } from "../Firebase/firebase";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import { Link } from "react-router-dom";




const RECORDS_PER_PAGE = 10;

export function BookingInvoices() {
  const queryClient = useQueryClient();
  
  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const bookingsCollection = collection(db, "invoices");
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
    const bookingsCollection = collection(db, "invoices");
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

  const handleView = (booking) => {
  setSelectedBooking(booking);
  setModalOpen(true);
};


  return (
    <div className="p-6 space-y-6 bg-white shadow rounded-lg w-[75vw] h-auto flex flex-col justify-center items-center gap-4 " style={{padding:'12px'}}>
        <div className="w-[95%] flex justify-between items-center" style={{padding:'4px'}}><h1 className="text-3xl text-black font-bold">Booking Invoices</h1><Link to={"/sales"} className="text-sm bg-black text-white rounded-lg" style={{padding:'4px'}} ><NoteAddIcon/> &nbsp;Create New Booking</Link></div>
      <div className="flex justify-between items-center mb-4 w-[95%]">
        <div className="flex flex-col w-1/3">
          <label htmlFor="search" className="mb-1 text-gray-700">Search</label>
          <input
            id="search"
            className="border px-2 py-1 rounded-lg w-full h-8"
            placeholder="Search Bookings..."
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Booking ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Customer Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>GSTIN</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Booking Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Advance</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600" style={{padding:'4px'}}>Actions</th>
              </tr>
            </thead>
            <tbody >
              {currentRecords.map((booking) => (
                <tr key={booking.id} className="border border-black hover:bg-gray-50 h-8 p-2" >
                  <td className="px-4 py-2" style={{padding:'4px'}}>{booking.bookingId}</td>
                  <td className="px-4 py-2" style={{padding:'4px'}}>{booking.customerdtls?.name}</td>
                  <td className="px-4 py-2" style={{padding:'4px'}}>{booking.customerdtls?.gstin}</td>
                  <td className="px-4 py-2" style={{padding:'4px'}}>{booking.invoiceDate}</td>
                  <td className="px-4 py-2" style={{padding:'4px'}}>{booking.adv}</td>
                  <td className="px-4 py-2 text-right " style={{padding:'4px'}}>
                    <button
                      className="border px-3 py-1 rounded-md text-white hover:text-[#005899] hover:border-[#005899] hover:bg-white bg-[#005899] "
                      onClick={() => handleView(booking)}
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

      {/* Add booking Form*/ }
      

      {/* Modal */}
      {modalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow max-w-lg w-full relative">
            <h2 className="text-lg font-bold mb-4">booking Details</h2>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(selectedBooking, null, 2)}
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

