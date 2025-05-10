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
    formState: { errors },
  } = useForm({
    defaultValues: {
      
      name: "",
      address: "",
      city: "",
      pincode: "",
      email: "",
      phone: "",
      pan: "",
      tan: "",
      gstin: "",
      turnover: "",
      tds: "",
      tcs: "",
      status: "Pending"
    },
  });
   // 2️⃣ Fetch Customer Code (Realtime Database)
    // useEffect(() => {
    //   const fetchCustomerCode = async () => {
    //     try {
    //       const lastNumberRef = ref(rtdb, 'lastCustomerNumber');
    //       const snapshot = await get(lastNumberRef);
    //       const lastNumber = snapshot.exists() ? snapshot.val() : 0;
    //       setValue('code', lastNumber + 1);
    //     } catch (error) {
    //       console.error("Error fetching customer code:", error);
    //     }
    //   };
  
    //   fetchCustomerCode();
    // }, [setValue]);



    const handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') return;
      setSnackbarOpen(false);
    };
    

  // const onSubmit = async (data) => {
  //   try {
  //     // Add data to Firestore under 'customers' collection
  //     // await setDoc(collection(db, "masters/ONBOARDING/CUSTOMER",data.code.toString()), data);
  //      // Create a document reference under 'masters/ONBOARDING/CUSTOMER' with document id as data.code
  // const docRef = doc(db, "masters/ONBOARDING/CUSTOMER", data.code.toString());
  //  // 1️⃣ Increment Realtime DB sequence number
  //     const lastNumberRef = ref(rtdb, 'lastCustomerNumber');
  //     await runTransaction(lastNumberRef, (currentValue) => {
  //       const newBookingNumber = (currentValue || 0) + 1;
  //       console.log(`Customer code ${newBookingNumber} reserved!`);
  //       return newBookingNumber;  // Increments in RTDB
  //     });
  // // Set the data
  // await setDoc(docRef, data);
  //     reset(); // Reset form fields
  //     navigate("/OnboardingCustomer"); // Navigate to another page after successful submission
  //   } catch (error) {
  //     console.error("Error adding customer:", error);
  //     alert("Failed to add customer. Please try again.");
  //   }
  // };

  const onSubmit = async (data) => {
    try {
      const docRef = doc(db, "masters/ONBOARDING/CUSTOMER", data.pan.toUpperCase());  // Use PAN as ID
  
      // 1️⃣ Check if document already exists
      const existingDoc = await getDoc(docRef);
  
      if (existingDoc.exists()) {
        // console.warn(`Customer with PAN ${data.pan.toUpperCase()} already exists:`, existingDoc.data());
        
        // alert(`A customer with PAN ${data.pan.toUpperCase()} already exists! Cannot add duplicate.`);
        setSnackbarMessage(`A customer with PAN ${data.pan.toUpperCase()} already exists!`);
setSnackbarSeverity("error");
setSnackbarOpen(true);

        return;  // Stop the function → don't overwrite
      }
  
      // // 2️⃣ Optional: increment customer code if you still need it
      // const lastNumberRef = ref(rtdb, 'lastCustomerNumber');
      // await runTransaction(lastNumberRef, (currentValue) => {
      //   const newBookingNumber = (currentValue || 0) + 1;
      //   console.log(`Customer code ${newBookingNumber} reserved!`);
      //   return newBookingNumber;
      // });
  
      // 3️⃣ Save new customer
      await setDoc(docRef, data);
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
    <div className="form-container bg-white mt-2 w-[70vw] p-6 flex flex-col justify-center items-center text-sm rounded shadow gap-2 ">
      <div className="flex  items-center justify-between w-[95%] mb-4 mt-4 h-20">
        <div className="flex flex-col items-start justify-center w-[95%] mb-4 mt-4">
          <h2 className="text-xl font-semibold">Customer Onboarding</h2>
          <p className="text-gray-600">
            Enter the customer details to onboard them into the system.
          </p>
        </div>
        <Link to="/OnboardingCustomer" className="bg-red-500 text-white p-2">
          <button><CloseIcon /></button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-[95%] space-y-4 ">
        {/* PAN, TAN, GSTIN in one row */}
        <div className="flex flex-wrap justify-between items-center gap-4 h-22">
          {/* PAN */}
          {/* <div className="flex-1 min-w-[200px]">
            <label className="block mb-1">PAN</label>
            <div className="flex items-center gap-2">
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="Enter PAN"
                {...register("pan", { required: true })}
                
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
             {errors.pan && (
              <span className="text-red-500 text-xs">PAN is required</span>
            )}
          </div> */}
          {/* PAN */}
<div className="flex-1 min-w-[200px]">
  <label className="block mb-1">
    PAN <span className="text-red-500">*</span>
  </label>
  <div className="flex items-center gap-2">
    <input
      className="border rounded px-2 py-1 flex-1"
      placeholder="Enter PAN"
      {...register("pan", { required: true })}
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
    <span className="text-red-500 text-xs">PAN is required</span>
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
            <label className="block mb-1">GSTIN</label>
            <div className="flex items-center gap-2">
              <input
                className="border rounded px-2 py-1 flex-1"
                placeholder="Enter GSTIN"
                {...register("gstin")}
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
              <span className="text-red-500 text-xs">{errors.gstin.message}</span>
            )}
          </div>
        </div>

        {/* Other inputs in grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
         {/*  <div>
            <label className="block mb-1">Code</label>
            <input
              className="border rounded px-2 py-1 w-full"
              placeholder="Enter Code"
              {...register("code")}
              readOnly
            />
            {/* {errors.code && (
              <span className="text-red-500 text-xs">Code is required</span>
            )} 
          </div>*/}

          {/* <div>
            <label className="block mb-1">Name</label>
            <input
              className="border rounded px-2 py-1 w-full"
              placeholder="Enter Name"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <span className="text-red-500 text-xs">Name is required</span>
            )}
          </div> */}
          
{/* Name */}
<div>
  <label className="block mb-1">
    Name <span className="text-red-500">*</span>
  </label>
  <input
    className="border rounded px-2 py-1 w-full"
    placeholder="Enter Name"
    {...register("name", { required: true })}
  />
  {errors.name && (
    <span className="text-red-500 text-xs">Name is required</span>
  )}
</div>

          {/* <div>
            <label className="block mb-1">Address</label>
            <input
              className="border rounded px-2 py-1 w-full"
              placeholder="Enter Address"
              {...register("address")}
            />
          </div> */}
          
{/* Address */}
<div>
  <label className="block mb-1">
    Address <span className="text-red-500">*</span>
  </label>
  <input
    className="border rounded px-2 py-1 w-full"
    placeholder="Enter Address"
    {...register("address", { required: true })}
  />
  {errors.address && (
    <span className="text-red-500 text-xs">Address is required</span>
  )}
</div>

          {/* <div>
            <label className="block mb-1">City</label>
            <input
              className="border rounded px-2 py-1 w-full"
              placeholder="Enter City"
              {...register("city")}
            />
          </div>

          <div>
            <label className="block mb-1">Pincode</label>
            <input
              type="number"
              className="border rounded px-2 py-1 w-full"
              placeholder="Enter Pincode"
              {...register("pincode")}
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="border rounded px-2 py-1 w-full"
              placeholder="Enter Email"
              {...register("email")}
            />
          </div>

          <div>
            <label className="block mb-1">Phone</label>
            <input
              className="border rounded px-2 py-1 w-full"
              placeholder="Enter Phone"
              {...register("phone")}
            />
          </div> */}

          {/* City */}
<div>
  <label className="block mb-1">
    City <span className="text-red-500">*</span>
  </label>
  <input
    className="border rounded px-2 py-1 w-full"
    placeholder="Enter City"
    {...register("city", { required: true })}
  />
  {errors.city && (
    <span className="text-red-500 text-xs">City is required</span>
  )}
</div>

{/* Pincode */}
<div>
  <label className="block mb-1">
    Pincode <span className="text-red-500">*</span>
  </label>
  <input
    type="number"
    className="border rounded px-2 py-1 w-full"
    placeholder="Enter Pincode"
    {...register("pincode", { required: true })}
  />
  {errors.pincode && (
    <span className="text-red-500 text-xs">Pincode is required</span>
  )}
</div>

{/* Email */}
<div>
  <label className="block mb-1">
    Email <span className="text-red-500">*</span>
  </label>
  <input
    type="email"
    className="border rounded px-2 py-1 w-full"
    placeholder="Enter Email"
    {...register("email", { required: true })}
  />
  {errors.email && (
    <span className="text-red-500 text-xs">Email is required</span>
  )}
</div>

{/* Phone */}
<div>
  <label className="block mb-1">
    Phone <span className="text-red-500">*</span>
  </label>
  <input
    className="border rounded px-2 py-1 w-full"
    placeholder="Enter Phone"
    {...register("phone", { required: true })}
  />
  {errors.phone && (
    <span className="text-red-500 text-xs">Phone is required</span>
  )}
</div>


          <div>
            <label className="block mb-1">Turnover</label>
            <input
              type="number"
              className="border rounded px-2 py-1 w-full"
              placeholder="Enter Turnover"
              {...register("turnover", { valueAsNumber: true })}
            />
          </div>

          <div>
            <label className="block mb-1">TDS</label>
            <input
              className="border rounded px-2 py-1 w-full"
              placeholder="Enter TDS"
              {...register("tds")}
            />
          </div>

          <div>
            <label className="block mb-1">TCS</label>
            <input
              className="border rounded px-2 py-1 w-full"
              placeholder="Enter TCS"
              {...register("tcs")}
            />
          </div>
        </div> 

        {/* Action buttons aligned to right */}
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

export default CustomerForm;

