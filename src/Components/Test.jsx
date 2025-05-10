import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { getFirestore,doc,addDoc,setDoc,getDoc,getDocs,updateDoc } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
export const Test = () => {
 const [data,setData]=useState([]);
 const uploadFirestore=async(e)=>{
    
    const uploadedRaw= e.target.files[0];
    if (!uploadedRaw) {
        console.error('No file selected');
        return;
    }
    const reader=new FileReader();
   
    reader.onload=async(e)=>{
        try{
        const fileData=e.target.result;
        const workBook=XLSX.read(fileData,{type:"array"});
        const fileName=workBook.SheetNames[0];
        const uploadedFile=workBook.Sheets[fileName];
        const uploadedJson=XLSX.utils.sheet_to_json(uploadedFile);
        setData(uploadedJson);
        
            const ref=doc(db,"E-Invoice","GSTR1");
            await setDoc(ref,{ data: uploadedJson });
            console.log("Uploaded to Firestore");
        }catch(err){
         console.log("failed to upload:",err)
        }
    }
    reader.onerror=(err)=>{
        console.log("failed to read file:",err)
    }

    reader.readAsArrayBuffer(uploadedRaw);
   
    


 }

  return (
    <div>
        <label htmlFor='file'>Upload File</label>
        <input id="file" type='file' accept='.xlsx,.xls' onChange={uploadFirestore}/>
    </div>
  )
}
