// src/services/projectService.js
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import your configured database instance

/**
 * Adds a brand new project record directly into your Firebase Firestore cloud database.
 * 
 * @param {Object} projectData - The data you want to save.
 * @returns {Promise<string>} - The unique ID that Firestore generated for this new record.
 */
export async function addProjectToFirebase(projectData) {
  try {
    // 1. Point Firebase to the specific "folder" (collection) where you want to save these.
    // If the "projects" collection doesn't exist yet, Firestore is smart enough to auto-create it!
    const projectsCollectionRef = collection(db, 'projects');

    // 2. Use await to pause the code until the cloud server confirms it securely saved the data.
    const docRef = await addDoc(projectsCollectionRef, {
      title: projectData.title,
      description: projectData.description,
      image: projectData.image,
      githubLink: projectData.githubLink,
      
      // Bonus: It's always best practice to track when a record was created!
      createdAt: new Date().toISOString()
    });

    console.log("Successfully saved! New Document ID:", docRef.id);
    return docRef.id; // Return the new ID in case your React UI needs to snap to it
    
  } catch (error) {
    // If the internet cuts out or permissions fail, catch the error safely so it doesn't crash your app.
    console.error("Critical Error adding project to Firebase: ", error);
    throw error; 
  }
}

/**
 * Retrieves all stored project documents from the Firebase Firestore database.
 * 
 * @returns {Promise<Array>} - An array of project objects containing their data and unique Firestore ID.
 */
export async function getProjectsFromFirebase() {
  try {
    const projectsCollectionRef = collection(db, 'projects');
    
    // Execute the fetch request to Google's servers
    const snapshot = await getDocs(projectsCollectionRef);

    // The snapshot returns complex Firebase objects. We need to map through them 
    // to extract exactly the raw JSON data and the unique ID we actually care about!
    const projectsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return projectsList;

  } catch (error) {
    console.error("Critical Error fetching projects from Firebase: ", error);
    throw error;
  }
}

/**
 * Updates an existing project document in the Firestore database.
 * 
 * @param {string} projectId - The unique Firestore ID of the document to edit.
 * @param {Object} updatedData - An object containing only the fields you wish to update.
 */
export async function updateProjectInFirebase(projectId, updatedData) {
  try {
    // 1. Point directly to the specific document using its ID
    const projectDocRef = doc(db, 'projects', projectId);
    
    // 2. Perform the update. Firebase smartly only overwrites the keys you provide!
    await updateDoc(projectDocRef, updatedData);
    
    console.log("Successfully updated document:", projectId);
  } catch (error) {
    console.error("Critical Error updating project in Firebase: ", error);
    throw error;
  }
}

/**
 * Permanently deletes a project document from the Firestore database.
 * 
 * @param {string} projectId - The unique Firestore ID of the document to delete.
 */
export async function deleteProjectFromFirebase(projectId) {
  try {
    // 1. Locate the specific document
    const projectDocRef = doc(db, 'projects', projectId);
    
    // 2. Erase it from the cloud
    await deleteDoc(projectDocRef);
    
    console.log("Successfully deleted document:", projectId);
  } catch (error) {
    console.error("Critical Error deleting project from Firebase: ", error);
    throw error;
  }
}
