import React, { useState ,useEffect} from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotesIcon from '@mui/icons-material/Notes';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import { collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import { db, rtdb } from "../Firebase/firebase"; 


import { get, ref , runTransaction} from "firebase/database";
import { MenuItem, TextField } from "@mui/material";

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
    watch,
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
      type:"",
      
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

    const VendorType = watch("type");
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
      setSnackbarMessage("GSTIN is required for B2B vendors.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    documentNumber = data.gstin.trim();
  } else if (data.type === "B2C") {
    if (!data.pan?.trim()) {
      setSnackbarMessage("PAN is required for B2C vendors.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    documentNumber = data.pan.trim();
  }
  const vendorData = {
    ...data,
    documentNumber,
  };
   const docRef = doc(db, `masters/ONBOARDING/VENDOR/${documentNumber}`); 
   

    // 1️⃣ Check if document already exists
         const existingDoc = await getDoc(docRef);
     
         if (existingDoc.exists()) {
           
           setSnackbarMessage(`Vendor already exists!`);
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
    <div className="form-container bg-white  w-[70vw] flex flex-col justify-center items-center text-sm rounded-xl shadow gap-2 h-[85vh]" >
      <div className="flex items-center justify-between w-full   h-20 bg-[#0b80d3] rounded-t-xl" style={{padding:'10px 22px'}}>
        <div className="flex flex-col items-start justify-center w-[95%]   ">
          <h2 className="text-2xl font-semibold text-white">Vendor Onboarding</h2>
          <p className="text-black text-lg">Enter vendor details to onboard them.</p>
        </div>
        <Link to="/OnboardingVendor" className="bg-red-500 text-white ">
          <button>
            <CloseIcon />
          </button>
        </Link>
      </div>
    
      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 overflow-y-auto" style={{padding:'0px 20px'}}>
  {/* VENDOR DETAILS */}
  <div style={{ padding: '10px' }} className="border border-gray-300 shadow-md rounded-xl">
    <h2 className="text-xl font-semibold h-8 flex justify-start items-start">Vendor Details&nbsp; <BusinessCenterIcon/></h2>
    <div className="grid grid-cols-3 gap-3">
      <TextField
        label="Vendor Type"
        variant="outlined"
        size="small"
        select
        fullWidth
        defaultValue=""
        {...register("type", { required: true })}
        error={!!errors.type}
        helperText={errors.type ? "Vendor Type is required" : ""}
      >
        <MenuItem value="B2B">B2B</MenuItem>
        <MenuItem value="B2C">B2C</MenuItem>
      </TextField>

      <TextField
        label="Business Type"
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Enter Business Type"
        {...register("vendorType", { required: true })}
        error={!!errors.vendorType}
        helperText={errors.vendorType ? "Business Type is required" : ""}
      />

      <TextField
        label="Nature of Business"
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Enter Nature of Business"
        {...register("nature")}
      />

      <TextField
        label="Payment Terms"
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Enter Payment Terms"
        {...register("paymentTerms")}
      />
    </div>
  </div>

  {/* CONTACT DETAILS */}
  <div style={{ padding: '10px', marginTop: '1.2rem' }} className="border border-gray-300 shadow-md rounded-xl">
    <h2 className="text-xl font-semibold h-8 flex justify-start items-start">Contact Details &nbsp; <PersonIcon/></h2>
    <div className="grid grid-cols-3 gap-3">
      <TextField
        label="Contact Name"
        variant="outlined"
        size="small"
        fullWidth
        {...register("contactName", { required: true })}
        error={!!errors.name}
        helperText={errors.name ? "Contact Name is required" : ""}
      />

      <TextField
        label="Contact Email"
        variant="outlined"
        size="small"
        fullWidth
        type="email"
        placeholder="Enter Email"
        {...register("contactEmail", { required: true })}
        error={!!errors.contactEmail}
        helperText={errors.contactEmail ? "Email is required" : ""}
      />

      <TextField
        label="Contact Phone"
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Enter Phone"
        {...register("contactPhone", { required: true })}
        error={!!errors.contactPhone}
        helperText={errors.contactPhone ? "Phone is required" : ""}
      />
    </div>
  </div>

  {/* ADDRESS DETAILS */}
  <div style={{ padding: '10px', marginTop: '1.2rem' }} className="border border-gray-300 shadow-md rounded-xl">
    <h2 className="text-xl font-semibold h-8 flex justify-start items-start">Address Details &nbsp;<LocationOnIcon/></h2>
    <div className="grid grid-cols-3 gap-3">
      <TextField
        label="Address"
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Enter Address"
        {...register("address")}
      />
      <TextField
        label="City"
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Enter City"
        {...register("city")}
      />
      <TextField
        label="State"
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Enter State"
        {...register("state")}
      />
      <TextField
        label="Country"
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Enter Country"
        {...register("country")}
      />
      <TextField
        label="Pincode"
        type="number"
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Enter Pincode"
        {...register("pincode")}
      />
    </div>
  </div>

  {/* BANK DETAILS */}
  <div style={{ padding: '10px', marginTop: '1.2rem' }} className="border border-gray-300 shadow-md rounded-xl">
    <h2 className="text-xl font-semibold h-8 flex justify-start items-start">Bank Details &nbsp;<CreditCardIcon/></h2>
    <div className="grid grid-cols-3 gap-3">
      <TextField
        label="Bank Name"
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Enter Bank Name"
        {...register("bankName")}
      />
      <TextField
        label="Bank Branch"
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Enter Bank Branch"
        {...register("bankBranch")}
      />
      <TextField
        label="Bank Account No"
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Enter Bank Account Number"
        {...register("bankAccountNo")}
      />
      <TextField
        label="IFSC Code"
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Enter IFSC Code"
        {...register("ifsc")}
      />
    </div>
  </div>

  {/* STATUTORY & FINANCIAL INFORMATION */}
  <div style={{ padding: '10px', marginTop: '1.2rem' }} className="border border-gray-300 shadow-md rounded-xl">
    <h2 className="text-xl font-semibold h-8 flex justify-start items-start">Statutory & Financial Information &nbsp;<AccountBalanceIcon/></h2>

    {/* PAN, TAN, GSTIN */}
    <div className="grid grid-cols-3 gap-4">
      <div className="flex gap-2" style={{marginBottom:'12px'}}>
        <TextField
          label="PAN"
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Enter PAN"
          {...register("pan")}
          error={!!errors.pan}
          helperText={errors.pan ? "PAN is required" : ""}
        />
        <button
          type="button"
          className="bg-blue-500 text-white   rounded h-10 w-18 "
          onClick={() => handleValidate("pan")}
          disabled={validatingField === "pan"}
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
          placeholder="Enter TAN"
          {...register("tan")}
          error={!!errors.tan}
          helperText={errors.tan?.message}
        />
        <button
          type="button"
          className="bg-blue-500 text-white   rounded h-10 w-18 "
          onClick={() => handleValidate("tan")}
          disabled={validatingField === "tan"}
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
          placeholder="Enter GSTIN"
          {...register("gstin")}
          error={!!errors.gstin}
          helperText={errors.gstin?.message}
        />
        <button
          type="button"
          className="bg-blue-500 text-white   rounded h-10 w-18 "
          onClick={() => handleValidate("gstin")}
          disabled={validatingField === "gstin"}
        >
          {validatingField === "gstin" ? "Validating..." : "Validate"}
        </button>
      </div>
    </div>

    {/* Turnover, TDS, TCS */}
    <div className="grid grid-cols-3 gap-4 ">
      <TextField
        label="Turnover"
        variant="outlined"
        size="small"
        type="number"
        fullWidth
        placeholder="Enter Turnover"
        {...register("turnover", { valueAsNumber: true })}
      />

      <TextField
        label="TDS"
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Enter TDS"
        {...register("tds")}
      />

      <TextField
        label="TCS"
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Enter TCS"
        {...register("tcs")}
      />
    </div>
  </div>

  {/* ADDITIONAL INFORMATION */}
  <div style={{padding:'10px',marginTop:'1.2rem'}} className="border  border-gray-300 shadow-md rounded-xl">
           <h2 className="text-xl font-semibold  h-8 flex justify-start items-start">Additional Information &nbsp; <NotesIcon/></h2>
           <div className="grid grid-cols-2 gap-4" >
            {/* CHECKBOXES */}
          <div className="border rounded-md  flex items-center" style={{padding:'12px'}}>
            <input
              type="checkbox"
              className="h-6 "
              {...register("msme")}
              style={{display:'inline-block',width:'10%'}}
            />
            <label style={{width:'90%'}}>MSME Registered</label>
          </div>

          <div className="border rounded-md  flex items-center">
            <input
              type="checkbox"
              className="h-6 "
              {...register("eInvoice")}
              style={{display:'inline-block',width:'10%'}}
            />
            <label style={{width:'90%'}}>E-Invoice Applicable</label>
          </div>

          
        

           </div>
          </div>
          



  {/* BUTTONS */}
  <div className="flex justify-end items-center gap-4  h-20">
    <button type="button" className="bg-gray-300   rounded hover:bg-gray-400 h-10 w-30">
      Save as Draft
    </button>
    <button type="submit" className="bg-green-500 text-white   rounded hover:bg-green-600 h-10 w-30">
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
