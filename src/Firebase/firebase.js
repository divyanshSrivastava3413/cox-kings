// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDL31D9elQj0M5dJsBanuUca5E41iRnzqs",
  authDomain: "invoicing-module.firebaseapp.com",
  databaseURL: "https://invoicing-module-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "invoicing-module",
  storageBucket: "invoicing-module.firebasestorage.app",
  messagingSenderId: "522886764900",
  appId: "1:522886764900:web:0f6fb94d8b54a0c2588271",
  measurementId: "G-75VDJ8MC1F"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db=getFirestore(app);
export const rtdb=getDatabase(app);