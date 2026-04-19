// Import the core Firebase App module
import { initializeApp } from "firebase/app";

// Import the specific Firestore Database tool from Firebase
import { initializeFirestore } from "firebase/firestore";

// Your Firebase configuration object
// NOTE: You must replace these placeholder values with the exact keys 
// from your actual Google Firebase Console dashboard (Project Settings)!

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

const firebaseConfig = {
  apiKey: "AIzaSyA1A3OLToXhOWQQdxxxVMVM5V8OrmPObXQ",
  authDomain: "my-portfolio-89169.firebaseapp.com",
  projectId: "my-portfolio-89169",
  storageBucket: "my-portfolio-89169.firebasestorage.app",
  messagingSenderId: "515991294284",
  appId: "1:515991294284:web:fbc4b8d124415cf3e27fe9",
  measurementId: "G-87YVCMCC0Q"
};

// Initialize Firebase with your secure config
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore using initializeFirestore to force 
// it to read "myportfolio" instead of falling back to default!
export const db = initializeFirestore(app, {}, "myportfolio");
