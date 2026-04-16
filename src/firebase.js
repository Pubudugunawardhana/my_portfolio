// Import the core Firebase App module
import { initializeApp } from "firebase/app";

// Import the specific Firestore Database tool from Firebase
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration object
// NOTE: You must replace these placeholder values with the exact keys 
// from your actual Google Firebase Console dashboard (Project Settings)!
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase with your secure config
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
