// src/services/messageService.js
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Saves a new incoming contact form submission to the 'messages' collection.
 * 
 * @param {Object} messageData - Expects { name, email, message }
 */
export async function submitContactMessage(messageData) {
  try {
    const messagesCollectionRef = collection(db, 'messages');
    
    // Add the form data along with a robust timestamp so the admin dashboard can sort them
    const docRef = await addDoc(messagesCollectionRef, {
      name: messageData.name,
      email: messageData.email,
      message: messageData.message,
      timestamp: new Date().toISOString(),
      readStatus: false // Helpful tag to let the Admin know if they've read it yet!
    });
    
    console.log("Message successfully saved to Cloud! ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Critical Error saving message to Firebase: ", error);
    throw error;
  }
}

/**
 * Retrieves all stored contact messages for the Admin Dashboard.
 * 
 * @returns {Promise<Array>} - An array of message documents sorted by newest first.
 */
export async function getContactMessages() {
  try {
    const messagesCollectionRef = collection(db, 'messages');
    
    // Using a Firebase query allows us to tell Google to sort them chronologically BEFORE downloading!
    const q = query(messagesCollectionRef, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);

    const messagesList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return messagesList;
  } catch (error) {
    console.error("Critical Error fetching messages from Firebase: ", error);
    throw error;
  }
}
