// lib/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD65ddVmGSDyGXm7OJ3HOPp0kM24eD5ZVw",
  authDomain: "duta-desa.firebaseapp.com",
  projectId: "duta-desa",
  storageBucket: "duta-desa.firebasestorage.app",
  messagingSenderId: "912414445466",
  appId: "1:912414445466:web:0a03ed30d41807eb68f423",
  measurementId: "G-QYTYJV0JEL",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
