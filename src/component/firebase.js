// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import getFirestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBekW3x-yXEBRXswxUg1ysPIrszJ5miokI",
  authDomain: "nat-result.firebaseapp.com",
  projectId: "nat-result",
  storageBucket: "nat-result.appspot.com",
  messagingSenderId: "1059180370221",
  appId: "1:1059180370221:web:5a5105ca35e606d85d9ba4",
  measurementId: "G-KV7JBE5YPW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app); // Ensure getFirestore is defined

// Export the db instance
export { db };
