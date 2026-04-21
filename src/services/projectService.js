// src/services/projectService.js
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { projects as defaultProjects } from '../data/portfolio';

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
      githubUrl: projectData.githubUrl || "",
      liveUrl: projectData.liveUrl || "",
      tech: projectData.tech || [],
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
 * Attaches a real-time listener to the 'projects' collection.
 */
export function listenToProjectsFromFirebase(callback) {
  const projectsCollectionRef = collection(db, 'projects');
  
  const unsubscribe = onSnapshot(projectsCollectionRef, (snapshot) => {
    const projectsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Forcefully sort locally by createdAt so newly added projects show up first
    projectsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    callback(projectsList);
  }, (error) => {
    console.error("Live Data Stream Error for Projects: ", error);
  });
  
  return unsubscribe;
}

/**
 * Intelligent single-execution check to aggressively upload static components if 
 * the cloud bucket is entirely empty
 */
export async function checkAndSeedProjectsIntelligently() {
  try {
    const projectsCollectionRef = collection(db, 'projects');
    const snapshot = await getDocs(projectsCollectionRef);
    if (snapshot.empty) {
      console.log("No projects found in Database! Initiating Auto-Seed Protocol...");
      
      const seedPromises = defaultProjects.map(projectData => {
        return addDoc(projectsCollectionRef, {
          title: projectData.title,
          description: projectData.description,
          image: projectData.image,
          githubUrl: projectData.githubUrl || "",
          liveUrl: projectData.liveUrl || "",
          tech: projectData.tech || [],
          createdAt: new Date().toISOString()
        });
      });
      
      await Promise.all(seedPromises);
      console.log("Projects Auto-Seed successful!");
    }
  } catch (error) {
    console.error("Auto-Seed failed: ", error);
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
