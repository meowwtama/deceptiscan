// 1. Import the functions you need from the SDKs you want
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

require("dotenv").config();

// 2. Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 4. Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);

// 5. Export them for use in the rest of your code
export { auth, firestore };
