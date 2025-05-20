// // src/components/CustomerForm.jsx

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";
// // import { useCustomerMutation } from "../lib/tanStack";
// import CloseIcon from '@mui/icons-material/Close';


// function CustomerForm() {
//   const navigate = useNavigate();
//   const { mutate } = useCustomerMutation();
//   const [validatingField, setValidatingField] = useState(null);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     getValues,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       code: "",
//       name: "",
//       address: "",
//       city: "",
//       pincode: "",
//       email: "",
//       phone: "",
//       pan: "",
//       tan: "",
//       gstin: "",
//       turnover: "",
//       tds: "",
//       tcs: "",
//     },
//   });

//   const onSubmit = (data) => {
//     mutate(data, {
//       onSuccess: () => {
//         reset();
//         navigate("/dashboard/user/Onboarding");
//       },
//     });
//   };

//   const handleValidate = async (field) => {
//     setValidatingField(field);
//     const value = getValues(field);
//     console.log(`Validating ${field}: ${value}`);

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
//       console.log(`${field} is valid`);
//     } catch (error) {
//       console.error(`Validation failed for ${field}:`, error);
//     } finally {
//       setValidatingField(null);
//     }
//   };

//   return (
//     <div className="form-container bg-white mt-2 w-[70vw] p-6 flex flex-col justify-center items-center text-sm rounded shadow gap-2 ">
//       <div className="flex  items-center justify-between w-[95%] mb-4 mt-4 h-20">
//         <div className="flex flex-col items-start justify-center w-[95%] mb-4 mt-4">
//         <h2 className="text-xl font-semibold">Customer Onboarding</h2>
//         <p className="text-gray-600">
//           Enter the customer details to onboard them into the system.
//         </p>
//         </div>
//         <Link to="/Onboarding" className="bg-red-500 text-white p-2">
//           <button><CloseIcon/></button>
//         </Link>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="w-[95%] space-y-4 ">
//         {/* PAN, TAN, GSTIN in one row */}
//         <div className="flex flex-wrap justify-between gap-4 h-20">
//           {/* PAN */}
//           <div className="flex-1 min-w-[200px]">
//             <label className="block mb-1">PAN</label>
//             <div className="flex items-center gap-2">
//               <input
//                 className="border rounded px-2 py-1 flex-1"
//                 placeholder="Enter PAN"
//                 {...register("pan")}
//               />
//               <button
//                 type="button"
//                 className="bg-blue-500 text-white px-3 py-1 rounded h-10 w-18"
//                 onClick={() => handleValidate("pan")}
//                 disabled={validatingField === "pan"}
//               >
//                 {validatingField === "pan" ? "Validating..." : "Validate"}
//               </button>
//             </div>
//             {errors.pan && (
//               <span className="text-red-500 text-xs">{errors.pan.message}</span>
//             )}
//           </div>

//           {/* TAN */}
//           <div className="flex-1 min-w-[200px]">
//             <label className="block mb-1">TAN</label>
//             <div className="flex items-center gap-2">
//               <input
//                 className="border rounded px-2 py-1 flex-1"
//                 placeholder="Enter TAN"
//                 {...register("tan")}
//               />
//               <button
//                 type="button"
//                 className="bg-blue-500 text-white px-3 py-1 rounded h-10 w-18"
//                 onClick={() => handleValidate("tan")}
//                 disabled={validatingField === "tan"}
//               >
//                 {validatingField === "tan" ? "Validating..." : "Validate"}
//               </button>
//             </div>
//             {errors.tan && (
//               <span className="text-red-500 text-xs">{errors.tan.message}</span>
//             )}
//           </div>

//           {/* GSTIN */}
//           <div className="flex-1 min-w-[200px]">
//             <label className="block mb-1">GSTIN</label>
//             <div className="flex items-center gap-2">
//               <input
//                 className="border rounded px-2 py-1 flex-1"
//                 placeholder="Enter GSTIN"
//                 {...register("gstin")}
//               />
//               <button
//                 type="button"
//                 className="bg-blue-500 text-white px-3 py-1 rounded h-10 w-18"
//                 onClick={() => handleValidate("gstin")}
//                 disabled={validatingField === "gstin"}
//               >
//                 {validatingField === "gstin" ? "Validating..." : "Validate"}
//               </button>
//             </div>
//             {errors.gstin && (
//               <span className="text-red-500 text-xs">{errors.gstin.message}</span>
//             )}
//           </div>
//         </div>

//         {/* Other inputs in grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
//           <div>
//             <label className="block mb-1">Code</label>
//             <input
//               className="border rounded px-2 py-1 w-full"
//               placeholder="Enter Code"
//               {...register("code", { required: true })}
//             />
//             {errors.code && (
//               <span className="text-red-500 text-xs">Code is required</span>
//             )}
//           </div>

//           <div>
//             <label className="block mb-1">Name</label>
//             <input
//               className="border rounded px-2 py-1 w-full"
//               placeholder="Enter Name"
//               {...register("name", { required: true })}
//             />
//             {errors.name && (
//               <span className="text-red-500 text-xs">Name is required</span>
//             )}
//           </div>

//           <div>
//             <label className="block mb-1">Address</label>
//             <input
//               className="border rounded px-2 py-1 w-full"
//               placeholder="Enter Address"
//               {...register("address")}
//             />
//           </div>

//           <div>
//             <label className="block mb-1">City</label>
//             <input
//               className="border rounded px-2 py-1 w-full"
//               placeholder="Enter City"
//               {...register("city")}
//             />
//           </div>

//           <div>
//             <label className="block mb-1">Pincode</label>
//             <input
//               type="number"
//               className="border rounded px-2 py-1 w-full"
//               placeholder="Enter Pincode"
//               {...register("pincode")}
//             />
//           </div>

//           <div>
//             <label className="block mb-1">Email</label>
//             <input
//               type="email"
//               className="border rounded px-2 py-1 w-full"
//               placeholder="Enter Email"
//               {...register("email")}
//             />
//           </div>

//           <div>
//             <label className="block mb-1">Phone</label>
//             <input
//               className="border rounded px-2 py-1 w-full"
//               placeholder="Enter Phone"
//               {...register("phone")}
//             />
//           </div>

//           <div>
//             <label className="block mb-1">Turnover</label>
//             <input
//               type="number"
//               className="border rounded px-2 py-1 w-full"
//               placeholder="Enter Turnover"
//               {...register("turnover", { valueAsNumber: true })}
//             />
//           </div>

//           <div>
//             <label className="block mb-1">TDS</label>
//             <input
//               className="border rounded px-2 py-1 w-full"
//               placeholder="Enter TDS"
//               {...register("tds")}
//             />
//           </div>

//           <div>
//             <label className="block mb-1">TCS</label>
//             <input
//               className="border rounded px-2 py-1 w-full"
//               placeholder="Enter TCS"
//               {...register("tcs")}
//             />
//           </div>
//         </div>

//         {/* Action buttons aligned to right */}
//         <div className="flex justify-end items-center gap-4 mt-4 h-20">
//           <button
//             type="button"
//             className="bg-gray-300 px-8 py-4 rounded hover:bg-gray-400 h-10 w-30"
//           >
//             Save as Draft
//           </button>
//           <button
//             type="submit"
//             className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 h-10 w-30"
//           >
//             Submit
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default CustomerForm;

// src/components/CustomerForm.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import { db, rtdb } from "../Firebase/firebase"; 
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from "react-hook-form";
import { get, ref , runTransaction} from "firebase/database";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { Info, ContactMail, AccountBalance } from '@mui/icons-material';
import GlobalTextFieldHoverStyle from "./GlobalTextFieldHoverStyle";



function CustomerForm() {
  const navigate = useNavigate();
  const [validatingField, setValidatingField] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [snackbarSeverity, setSnackbarSeverity] = useState("info");  // "success" | "error" | "warning" | "info"




  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      
      name: "",
      address: "",
      city: "",
      state:"",
      country:"",
      pincode: "",
      email: "",
      phone: "",
      pan: "",
      tan: "",
      gstin: "",
      type:"",
      aadhar:"",
      
      tds: "",
      tcs: "",
      status: "Pending"
    },
  });
   

  const customerType = watch("type");
  
const pan = watch("pan");
const aadhar = watch("aadhar");
const gstin = watch("gstin");

    const handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') return;
      setSnackbarOpen(false);
    };
    

  const onSubmit = async (data) => {
    try {
          let documentNumber = "";

  if (data.type === "B2B") {
    if (!data.gstin?.trim()) {
      setSnackbarMessage("GSTIN is required for B2B customers.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    documentNumber = data.gstin.trim();
  } else if (data.type === "B2C") {
    if (!data.pan?.trim() && !data.aadhar?.trim()) {
      setSnackbarMessage("Either PAN or Aadhar is required for B2C customers.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    documentNumber = data.pan?.trim() || data.aadhar?.trim();
  }
  const customerData = {
    ...data,
    documentNumber,
  };

      const docRef = doc(db, `masters/ONBOARDING/CUSTOMER/${documentNumber}`);  // Use PAN as ID
  
      // 1️⃣ Check if document already exists
      const existingDoc = await getDoc(docRef);
  
      if (existingDoc.exists()) {
        // console.warn(`Customer with PAN ${data.pan.toUpperCase()} already exists:`, existingDoc.data());
        
        // alert(`A customer with PAN ${data.pan.toUpperCase()} already exists! Cannot add duplicate.`);
        setSnackbarMessage(`Customer already exists!`);
setSnackbarSeverity("error");
setSnackbarOpen(true);

        return;  // Stop the function → don't overwrite
      }
  
      
  
      // 3️⃣ Save new customer
      await setDoc(docRef, customerData);
      // console.log(`Customer ${data.name.toUpperCase()} added successfully.`);
      setSnackbarMessage(`Customer ${data.name.toUpperCase()} added successfully!`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
  
      reset();
      setTimeout(() => {
        navigate("/OnboardingCustomer");
      }, 1500); 
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("Failed to add customer. Please try again.");
    }
  };
  
  const handleValidate = async (field) => {
    setValidatingField(field);
    const value = getValues(field);
    console.log(`Validating ${field}: ${value}`);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      console.log(`${field} is valid`);
    } catch (error) {
      console.error(`Validation failed for ${field}:`, error);
    } finally {
      setValidatingField(null);
    }
  };

  return (

<div className="form-container bg-white mt-2 w-[70vw] p-6 flex flex-col justify-center items-center text-sm rounded-xl shadow gap-2 h-[85vh]">
      <div className="flex items-center justify-between w-full mb-4 mt-4 h-20 bg-[#0b80d3] rounded-t-xl" style={{padding:'10px 22px'}}>
        <div className="flex flex-col items-start justify-center w-[95%] mb-4 mt-4">
          <h2 className="text-2xl font-semibold text-white">Customer Onboarding</h2>
          <p className="text-black text-lg">
            Enter the customer details to onboard them into the system.
          </p>
        </div>
        <Link to="/OnboardingCustomer" className="bg-red-500 text-white p-2">
          <button><CloseIcon /></button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 overflow-y-auto" style={{padding:'0px 20px'}}>
     
        <div style={{ padding: '10px' }} className="border border-gray-300 shadow-md rounded-xl" >
          <h2 className="text-xl font-semibold h-10 flex justify-start items-center" style={{marginBottom:'5px'}}>Basic Information&nbsp; <Info/></h2>
          <div className="grid grid-cols-3 gap-3">
               <GlobalTextFieldHoverStyle/>
            <TextField
              label="Name"
              variant="outlined"
              size="small"
              fullWidth
              {...register("name", { required: true })}
              error={!!errors.name}
              helperText={errors.name ? "Name is required" : ""}
            />

            <TextField
              label="Customer Type"
              variant="outlined"
              size="small"
              select
              fullWidth
              defaultValue=""
              {...register("type", { required: true })}
              error={!!errors.type}
              helperText={errors.type ? "Customer Type is required" : ""}
            >
              <MenuItem value="B2B">B2B</MenuItem>
              <MenuItem value="B2C">B2C</MenuItem>
            </TextField>

            <TextField
              label="Aadhar Number"
              variant="outlined"
              size="small"
              fullWidth
              {...register("aadhar")}
              error={!!errors.aadhar}
              helperText={errors.aadhar ? "Aadhar is required" : ""}
            />

            <TextField
              label="Status"
              variant="outlined"
              size="small"
              select
              fullWidth
              defaultValue="Pending"
              {...register("status")}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </TextField>
          </div>
        </div>

        <div style={{ padding: '10px', marginTop: '1.2rem' }} className="border border-gray-300 shadow-md rounded-xl">
          <h2 className="text-xl font-semibold h-10 flex justify-start items-center" style={{marginBottom:'5px'}}>Contact Information&nbsp;<ContactMail/></h2>
          <div className="grid grid-cols-3 gap-4">
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              size="small"
              fullWidth
              {...register("email", { required: true })}
              error={!!errors.email}
              helperText={errors.email ? "Email is required" : ""}
            />

            <TextField
              label="Phone"
              variant="outlined"
              size="small"
              fullWidth
              {...register("phone", { required: true })}
              error={!!errors.phone}
              helperText={errors.phone ? "Phone is required" : ""}
            />

            <TextField
              label="Address"
              variant="outlined"
              size="small"
              fullWidth
              {...register("address", { required: true })}
              error={!!errors.address}
              helperText={errors.address ? "Address is required" : ""}
            />

            <TextField
              label="Pincode"
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              {...register("pincode", { required: true })}
              error={!!errors.pincode}
              helperText={errors.pincode ? "Pincode is required" : ""}
            />

            <TextField label="City" variant="outlined" size="small" fullWidth {...register("city")} />
            <TextField label="State" variant="outlined" size="small" fullWidth {...register("state")} />
            <TextField label="Country" variant="outlined" size="small" fullWidth {...register("country")} />
          </div>
        </div>

        <div style={{ padding: '10px', marginTop: '1.2rem' }} className="border border-gray-300 shadow-md rounded-xl">
          <h2 className="text-xl font-semibold h-10 flex justify-start items-center" style={{marginBottom:'5px'}}>Statutory & Financial Information&nbsp;<AccountBalance/></h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex gap-2">
              <TextField
                label="PAN"
                variant="outlined"
                size="small"
                fullWidth
                {...register("pan")}
                error={!!errors.pan}
                helperText={errors.pan ? "PAN is required" : ""}
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-1 rounded h-10 w-18"
                onClick={() => handleValidate("pan")}
                disabled={validatingField === "pan"}
                style={{padding:'4px'}}
              >
                {validatingField === "pan" ? "Validating..." : "Validate"}
              </button>
            </div>

            <div className="flex gap-2">
              <TextField
                label="TAN"
                variant="outlined"
                size="small"
                fullWidth
                {...register("tan")}
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-1 rounded h-10 w-18"
                onClick={() => handleValidate("tan")}
                disabled={validatingField === "tan"}
                style={{padding:'4px'}}
              >
                {validatingField === "tan" ? "Validating..." : "Validate"}
              </button>
            </div>

            <div className="flex gap-2">
              <TextField
                label="GSTIN"
                variant="outlined"
                size="small"
                fullWidth
                {...register("gstin", {
                  required: customerType === "B2B" ? "GSTIN is required for B2B" : false,
                })}
                error={!!errors.gstin}
                helperText={errors.gstin?.message || ""}
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-1 rounded h-10 w-18"
                onClick={() => handleValidate("gstin")}
                disabled={validatingField === "gstin"}
                style={{padding:'4px'}}
              >
                {validatingField === "gstin" ? "Validating..." : "Validate"}
              </button>
            </div>
            <TextField label="TDS" variant="outlined" size="small" fullWidth {...register("tds")} />
            <TextField label="TCS" variant="outlined" size="small" fullWidth {...register("tcs")} />
          </div>

          
            
          
        </div>

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
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default CustomerForm;

