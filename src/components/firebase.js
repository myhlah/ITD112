// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJrVLTRSJt33bP7gnrZyjKCV7up8JAyuU",
  authDomain: "lab1-1bf86.firebaseapp.com",
  projectId: "lab1-1bf86",
  storageBucket: "lab1-1bf86.appspot.com",
  messagingSenderId: "878600966968",
  appId: "1:878600966968:web:628b53951e513e75e927cd",
  measurementId: "G-71N9853K8Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };