import React, { useState ,useEffect} from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


import { collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import { db, rtdb } from "../Firebase/firebase"; 


import { get, ref , runTransaction} from "firebase/database";

function VendorForm() {
  const navigate = useNavigate();
  const [validatingField, setValidatingField] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      
      vendorType: "",
      state: "",
      country: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      msme: false,
      eInvoice: false,
      bankName: "",
      bankBranch: "",
      bankAccountNo: "",
      ifsc: "",
      nature: "",
      paymentTerms: "",
      
      address: "",
      city: "",
      pincode: "",
      
      pan: "",
      tan: "",
      gstin: "",
      turnover: "",
      tds: "",
      tcs: "",
      
    },
  });
    // useEffect(() => {
    //     const fetchVendorCode = async () => {
    //       try {
    //         const lastNumberRef = ref(rtdb, 'lastVendorNumber');
    //         const snapshot = await get(lastNumberRef);
    //         const lastNumber = snapshot.exists() ? snapshot.val() : 0;
    //         setValue('code', lastNumber + 1);
    //       } catch (error) {
    //         console.error("Error fetching Vendor code:", error);
    //       }
    //     };
    
    //     fetchVendorCode();
    //   }, [setValue]);
    const handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') return;
      setSnackbarOpen(false);
    };

 
   const onSubmit = async (data) => {
     try {
       // Add data to Firestore under 'customers' collection
       // await setDoc(collection(db, "masters/ONBOARDING/CUSTOMER",data.code.toString()), data);
        // Create a document reference under 'masters/ONBOARDING/CUSTOMER' with document id as data.code
   const docRef = doc(db, "masters/ONBOARDING/VENDOR", data.gstin.toUpperCase());  // Use PAN as ID
    // 1️⃣ Increment Realtime DB sequence number
      //  const lastNumberRef = ref(rtdb, 'lastVendorNumber');
      //  await runTransaction(lastNumberRef, (currentValue) => {
      //    const newBookingNumber = (currentValue || 0) + 1;
      //    console.log(`Vendor code ${newBookingNumber} reserved!`);
      //    return newBookingNumber;  // Increments in RTDB
      //  });
   // Set the data

    // 1️⃣ Check if document already exists
         const existingDoc = await getDoc(docRef);
     
         if (existingDoc.exists()) {
           // console.warn(`Customer with PAN ${data.pan.toUpperCase()} already exists:`, existingDoc.data());
           
           // alert(`A customer with PAN ${data.pan.toUpperCase()} already exists! Cannot add duplicate.`);
           setSnackbarMessage(`A Vendor with PAN ${data.gstin.toUpperCase()} already exists!`);
   setSnackbarSeverity("error");
   setSnackbarOpen(true);
   
           return;  // Stop the function → don't overwrite
         }
     
   await setDoc(docRef, data);
   setSnackbarMessage(`Vendor added successfully!`);
   setSnackbarSeverity("success");
   setSnackbarOpen(true);
       reset(); // Reset form fields
       setTimeout(() => {
        navigate("/OnboardingVendor");
      }, 1500); 
       
     } catch (error) {
       console.error("Error adding Vendor:", error);
       alert("Failed to add Vendor. Please try again.");
     }
   };

  const handleValidate = async (field) => {
    // setValidatingField(field);
    // const value = getValues(field);
    // console.log(`Validating ${field}: ${value}`);
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // console.log(`${field} is valid`);
    // setValidatingField(null);
  };

  return (
    <div className="form-container bg-white mt-2 w-[70vw] p-6 flex flex-col justify-center items-center text-sm rounded shadow gap-2">
      <div className="flex items-center justify-between w-[95%] mb-4 mt-4 h-20">
        <div className="flex flex-col items-start justify-center w-[95%] mb-4 mt-4">
          <h2 className="text-xl font-semibold">Vendor Onboarding</h2>
          <p className="text-gray-600">Enter vendor details to onboard them.</p>
        </div>
        <Link to="/OnboardingVendor" className="bg-red-500 text-white p-2">
          <button>
            <CloseIcon />
          </button>
        </Link>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-[95%] space-y-4">

        {/* PAN/TAN/GST */}
        <div className="flex justify-between items-center gap-4 " style={{marginBottom:'10px'}}>
{/* PAN */}
<div className="flex-1 min-w-[200px]">
  <label className="block mb-1">
    PAN 
  </label>
  <div className="flex items-center gap-2">
    <input
      className="border rounded px-2 py-1 flex-1"
      placeholder="Enter PAN"
      {...register("pan")}
    />
    <button
      type="button"
      className="bg-blue-500 text-white px-3 py-1 rounded h-10 w-18"
      onClick={() => handleValidate("pan")}
      disabled={validatingField === "pan"}
    >
      {validatingField === "pan" ? "Validating..." : "Validate"}
    </button>
  </div>
  {errors.pan && (
    <span className="text-red-500 text-xs">{errors.pan.message}</span>
  )}
</div>

 {/* TAN */}
 <div className="flex-1 min-w-[200px]">
            <label className="block mb-1">TAN</label>
            <div className="flex items-center gap-2">
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="Enter TAN"
                {...register("tan")}
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-1 rounded h-10 w-18"
                onClick={() => handleValidate("tan")}
                disabled={validatingField === "tan"}
              >
                {validatingField === "tan" ? "Validating..." : "Validate"}
              </button>
            </div>
            {errors.tan && (
              <span className="text-red-500 text-xs">{errors.tan.message}</span>
              
            )}
          </div>

          {/* GSTIN */}
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-1">GSTIN<span className="text-red-500">*</span></label>
            <div className="flex items-center gap-2">
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="Enter GSTIN"
                {...register("gstin", { required: true })}
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-1 rounded h-10 w-18"
                onClick={() => handleValidate("gstin")}
                disabled={validatingField === "gstin"}
              >
                {validatingField === "gstin" ? "Validating..." : "Validate"}
              </button>
            </div>
            {errors.gstin && (
              // <span className="text-red-500 text-xs">{errors.gstin.message}</span>
              <span className="text-red-500 text-xs">GSTIN is required</span>

            )}
          </div>
        </div>

        {/* GRID DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
         

          {/* Name */}
<div>
  <label className="block mb-1">
    Contact Name <span className="text-red-500">*</span>
  </label>
  <input
    className="border rounded px-2 py-1 w-full"
    placeholder="Enter Contact Name"
    {...register("contactName", { required: true })}
  />
  {errors.contactName && (
    <span className="text-red-500 text-xs">Contact name is required</span>
  )}
</div>

          
<div>
  <label className="block mb-1">
    Vendor Type <span className="text-red-500">*</span>
  </label>
  <input
    className="border rounded px-2 py-1 w-full"
    placeholder="Enter Type"
    {...register("vendorType", { required: true })}
  />
  {errors.vendorType && (
    <span className="text-red-500 text-xs">Vendor Type is required</span>
  )}
</div>

          {/* Email */}
<div>
  <label className="block mb-1">
    Contact Email <span className="text-red-500">*</span>
  </label>
  <input
    type="email"
    className="border rounded px-2 py-1 w-full"
    placeholder="Enter Email"
    {...register("contactEmail", { required: true })}
  />
  {errors.contactEmail && (
    <span className="text-red-500 text-xs">Email is required</span>
  )}
</div>

          
{/* Phone */}
<div>
  <label className="block mb-1">
    Contact Phone <span className="text-red-500">*</span>
  </label>
  <input
    className="border rounded px-2 py-1 w-full"
    placeholder="Enter Phone"
    {...register("contactPhone", { required: true })}
  />
  {errors.contactPhone && (
    <span className="text-red-500 text-xs">Phone is required</span>
  )}
</div>

          <div>
            <label>Address</label>
            <input
              className="border rounded px-2 py-1 w-full"
              {...register("address")}
              placeholder="Enter Address"
            />
          </div>

          <div>
            <label>City</label>
            <input
              className="border rounded px-2 py-1 w-full"
              {...register("city")}
              placeholder="Enter City"
            />
          </div>

          <div>
            <label>State</label>
            <input
              className="border rounded px-2 py-1 w-full"
              {...register("state")}
              placeholder="Enter State"
            />
          </div>

          <div>
            <label>Country</label>
            <input
              className="border rounded px-2 py-1 w-full"
              {...register("country")}
              placeholder="Enter Country"
            />
          </div>

          <div>
            <label>Pincode</label>
            <input
              type="number"
              className="border rounded px-2 py-1 w-full"
              {...register("pincode")}
              placeholder="Enter Pincode"
            />
          </div>

          <div>
            <label>Turnover</label>
            <input
              type="number"
              className="border rounded px-2 py-1 w-full"
              {...register("turnover")}
              placeholder="Enter Turnover"
            />
          </div>

          <div>
            <label>TDS</label>
            <input
              className="border rounded px-2 py-1 w-full"
              {...register("tds")}
              placeholder="Enter TDS"
            />
          </div>

          <div>
            <label>TCS</label>
            <input
              className="border rounded px-2 py-1 w-full"
              {...register("tcs")}
              placeholder="Enter TCS"
            />
          </div>

          {/* CHECKBOXES */}
          <div className="border rounded-md p-4 flex items-center" style={{padding:'12px'}}>
            <input
              type="checkbox"
              className="h-6 mr-2"
              {...register("msme")}
              style={{display:'inline-block',width:'10%'}}
            />
            <label style={{width:'90%'}}>MSME Registered</label>
          </div>

          <div className="border rounded-md p-4 flex items-center">
            <input
              type="checkbox"
              className="h-6 mr-2"
              {...register("eInvoice")}
              style={{display:'inline-block',width:'10%'}}
            />
            <label style={{width:'90%'}}>E-Invoice Applicable</label>
          </div>

          {/* BANK DETAILS */}
          <div>
            <label>Bank Name</label>
            <input
              className="border rounded px-2 py-1 w-full"
              {...register("bankName")}
              placeholder="Enter Bank Name"
            />
          </div>

          <div>
            <label>Bank Branch</label>
            <input
              className="border rounded px-2 py-1 w-full"
              {...register("bankBranch")}
              placeholder="Enter Bank Branch"
            />
          </div>

          <div>
            <label>Bank Account No</label>
            <input
              className="border rounded px-2 py-1 w-full"
              {...register("bankAccountNo")}
              placeholder="Enter Bank Account Number"
            />
          </div>

          <div>
            <label>IFSC Code</label>
            <input
              className="border rounded px-2 py-1 w-full"
              {...register("ifsc")}
              placeholder="Enter IFSC Code"
            />
          </div>

          <div>
            <label>Nature of Business</label>
            <input
              className="border rounded px-2 py-1 w-full"
              {...register("nature")}
              placeholder="Enter Nature of Business"
            />
          </div>

          <div>
            <label>Payment Terms</label>
            <input
              className="border rounded px-2 py-1 w-full"
              {...register("paymentTerms")}
              placeholder="Enter Payment Terms"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end items-center gap-4 mt-4 h-20">
          <button
            type="button"
            className="bg-gray-300 px-8 py-4 rounded hover:bg-gray-400 h-10 w-30"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 h-10 w-30"
          >
            Submit
          </button>
        </div>
      </form>
         <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled" sx={{ width: '100%', }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default VendorForm;
