// src/services/skillsService.js
import { collection, doc, setDoc, deleteDoc, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { skills as defaultSkills } from '../data/portfolio';

// Reference to the standalone 'skills' collection
const skillsCollectionRef = collection(db, 'skills');

/**
 * Attaches a real-time listener to the entire 'skills' collection.
 * 
 * @param {Function} callback - Function specifically executed whenever ANY skill document changes.
 * @returns {Function} - An unsubscribe function to clean up the listener on dismount.
 */
export function listenToSkillsFromFirebase(callback) {
  // onSnapshot violently pushes updates to the frontend immediately when the database changes!
  const unsubscribe = onSnapshot(skillsCollectionRef, (snapshot) => {
    const list = snapshot.docs.map(doc => doc.data());
    callback(list);
  }, (error) => {
    console.error("Live Data Stream Error for Skills: ", error);
  });
  
  return unsubscribe;
}

/**
 * Uploads a skill category into the dedicated 'skills' collection using its own name as the Key.
 */
export async function addOrUpdateSkillInFirebase(categoryObj) {
  try {
    // We use the category name as the physical Document ID for easy direct targeting
    const docRef = doc(db, 'skills', categoryObj.name);
    await setDoc(docRef, categoryObj, { merge: true });
    
    console.log(`Successfully pushed ${categoryObj.name} to Cloud!`);
  } catch (error) {
    console.error(`Error saving ${categoryObj.name}: `, error);
    throw error;
  }
}

/**
 * Removes a dedicated skill document from the collection.
 */
export async function deleteSkillFromFirebase(categoryName) {
  try {
    const docRef = doc(db, 'skills', categoryName);
    await deleteDoc(docRef);
    console.log(`Deleted ${categoryName} from Cloud!`);
  } catch (error) {
    console.error(`Error deleting ${categoryName}: `, error);
    throw error;
  }
}

/**
 * ONE-TIME execution utility that scans the database. If it is entirely mathematically empty,
 * it pulls the primitive dummy arrays out of portfolio.js and injects them deeply into Firebase.
 */
export async function checkAndSeedSkillsIntelligently() {
  try {
    const snapshot = await getDocs(skillsCollectionRef);
    if (snapshot.empty) {
      console.log("No skills found in Database! Initiating Auto-Seed Protocol...");
      
      const seedPromises = defaultSkills.map(skillSet => {
        const cleanData = { name: skillSet.name, tech: skillSet.tech };
        return addOrUpdateSkillInFirebase(cleanData);
      });
      
      await Promise.all(seedPromises);
      console.log("Auto-Seed successful!");
    }
  } catch (error) {
    console.error("Auto-Seed failed: ", error);
  }
}
