// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCKLZehYSVpk9VINElT7mCsEg7LmF3an1I",
  authDomain: "pexpense-pro.firebaseapp.com",
  projectId: "pexpense-pro",
  storageBucket: "pexpense-pro.firebasestorage.app",
  messagingSenderId: "842575328802",
  appId: "1:842575328802:web:2f524e329f908df40e3c7b",
  measurementId: "G-XD31F8FRRV"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ EXPORT these
export const auth = getAuth(app);
export const db = getFirestore(app);
