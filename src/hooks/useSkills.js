import { useState, useEffect } from 'react';
import { 
  listenToSkillsFromFirebase, 
  addOrUpdateSkillInFirebase, 
  deleteSkillFromFirebase,
  checkAndSeedSkillsIntelligently 
} from '../services/skillsService';

export function useSkills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    // 1. Immediately scan and seed the cloud if it's completely empty!
    checkAndSeedSkillsIntelligently();

    // 2. Attach our live pipeline to the React Local State
    const unsubscribe = listenToSkillsFromFirebase((liveDataArray) => {
      setSkills(liveDataArray);
    });

    return () => unsubscribe();
  }, []);

  const addSkillCategory = async (categoryObj) => {
    await addOrUpdateSkillInFirebase(categoryObj);
  };

  const updateSkillCategory = async (oldName, newObj) => {
    // If they changed the category NAME itself, we must physically delete the old document 
    // and create a brand new one since the Document ID is the name!
    if (oldName !== newObj.name) {
      await deleteSkillFromFirebase(oldName);
    }
    
    // Upload the modified payload
    await addOrUpdateSkillInFirebase(newObj);
  };

  const deleteSkillCategory = async (categoryName) => {
    await deleteSkillFromFirebase(categoryName);
  };

  return { skills, addSkillCategory, updateSkillCategory, deleteSkillCategory };
}
