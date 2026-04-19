// src/services/aboutService.js
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Retrieves the specific "main" bio document from the 'about' collection.
 * Unlike projects where there are many, we only ever expect one singular About block.
 * 
 * @returns {Promise<Object>} - An object containing name, role, email, etc.
 */
export async function getAboutFromFirebase() {
  try {
    // 1. Point strictly to the specific collection ('about') and exactly one document ('main')
    const aboutDocRef = doc(db, 'about', 'main');
    
    // 2. Execute the fetch request to Google
    const snapshot = await getDoc(aboutDocRef);

    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      console.warn("About document does not exist yet. Please create it in the Admin Dashboard.");
      return null;
    }
  } catch (error) {
    console.error("Critical Error fetching About section from Firebase: ", error);
    throw error;
  }
}

/**
 * Attaches a real-time listener to the 'main' document in 'about' collection.
 * 
 * @param {Function} callback - Function specifically executed whenever data changes.
 * @returns {Function} - An unsubscribe function to clean up the listener on dismount.
 */
export function listenToAboutFromFirebase(callback) {
  const aboutDocRef = doc(db, 'about', 'main');
  
  // onSnapshot violently pushes updates to the frontend immediately when the database changes!
  const unsubscribe = onSnapshot(aboutDocRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Live Data Stream Error: ", error);
  });
  
  return unsubscribe;
}

/**
 * Pushes new bio data to the 'main' document in the 'about' collection.
 * 
 * @param {Object} aboutData - The updated bio info to save
 */
export async function updateAboutInFirebase(aboutData) {
  try {
    const aboutDocRef = doc(db, 'about', 'main');
    
    // We use setDoc with { merge: true } here.
    // This brilliantly auto-creates the document if it doesn't exist yet, 
    // but acts like updateDoc if it already does!
    await setDoc(aboutDocRef, aboutData, { merge: true });
    
    console.log("Successfully updated About data in Firebase Cloud!");
  } catch (error) {
    console.error("Critical Error updating About section in Firebase: ", error);
    throw error;
  }
}
