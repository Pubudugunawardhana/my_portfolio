import { useState, useEffect, useCallback } from 'react';
import { 
  addOrUpdateSkillInFirebase, 
  deleteSkillFromFirebase,
  getSkillsFromFirebase 
} from '../services/skillsService';

export function useSkills() {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSkills = useCallback(async () => {
    try {
      const data = await getSkillsFromFirebase();
      setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
    window.addEventListener('focus', fetchSkills);
    
    // Polling interval for true real-time effect
    const interval = setInterval(fetchSkills, 5000);
    
    return () => {
      window.removeEventListener('focus', fetchSkills);
      clearInterval(interval);
    };
  }, [fetchSkills]);

  const addSkillCategory = async (categoryObj) => {
    await addOrUpdateSkillInFirebase(categoryObj);
    fetchSkills();
  };

  const updateSkillCategory = async (oldName, newObj) => {
    // We update the skill (if using old ID)
    if (oldName !== newObj.name && oldName.length > 5) { // oldName is ID here
      await deleteSkillFromFirebase(oldName);
    }
    await addOrUpdateSkillInFirebase(newObj);
    fetchSkills();
  };

  const deleteSkillCategory = async (categoryName) => {
    await deleteSkillFromFirebase(categoryName);
    fetchSkills();
  };

  return { skills, isLoading, addSkillCategory, updateSkillCategory, deleteSkillCategory };
}
