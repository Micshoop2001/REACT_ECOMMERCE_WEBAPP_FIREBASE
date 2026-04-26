// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAgnRIqiTpZjruEGGMSX3Ydpf2CjkLZayc",
  authDomain: "react-ecommerce-webapp-ae2b8.firebaseapp.com",
  projectId: "react-ecommerce-webapp-ae2b8",
  storageBucket: "react-ecommerce-webapp-ae2b8.firebasestorage.app",
  messagingSenderId: "507186087175",
  appId: "1:507186087175:web:1bf43b28d1c394f2e3f1a2",
  measurementId: "G-FFM3FCQYLC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
