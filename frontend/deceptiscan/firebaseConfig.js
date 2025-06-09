import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { FIREBASE_CONFIG } from "./config";

// Initialize once
if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

// Export the compat auth instance
export const auth = firebase.auth();
