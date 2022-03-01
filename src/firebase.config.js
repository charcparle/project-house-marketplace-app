// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnJaR86fjH19Vb6bwNDZ5Vyz25ATGFHxI",
  authDomain: "project-house-marketplace-app.firebaseapp.com",
  projectId: "project-house-marketplace-app",
  storageBucket: "project-house-marketplace-app.appspot.com",
  messagingSenderId: "917274658972",
  appId: "1:917274658972:web:34ff477188ab3bd4bb8559",
  measurementId: "G-KH6880V004",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
