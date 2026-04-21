// src/services/certificationService.js
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Attaches a real-time listener to the 'certifications' collection.
 */
export function listenToCertificationsFromFirebase(callback) {
  const certificationsRef = collection(db, 'certifications');
  
  const unsubscribe = onSnapshot(certificationsRef, (snapshot) => {
    const list = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Most recent certifications first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    callback(list);
  }, (error) => {
    console.error("Live Data Stream Error for Certifications: ", error);
  });
  
  return unsubscribe;
}

export async function addCertificationToFirebase(data) {
  try {
    const certificationsRef = collection(db, 'certifications');
    const docRef = await addDoc(certificationsRef, {
      title: data.title || "",
      issuer: data.issuer || "",
      date: data.date || "",
      credentialUrl: data.credentialUrl || "",
      image: data.image || "",
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding certification to Firebase: ", error);
    throw error;
  }
}

export async function updateCertificationInFirebase(id, updatedData) {
  try {
    const docRef = doc(db, 'certifications', id);
    await updateDoc(docRef, updatedData);
  } catch (error) {
    console.error("Error updating certification in Firebase: ", error);
    throw error;
  }
}

export async function deleteCertificationFromFirebase(id) {
  try {
    const docRef = doc(db, 'certifications', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting certification from Firebase: ", error);
    throw error;
  }
}
