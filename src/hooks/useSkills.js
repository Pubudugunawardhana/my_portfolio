import { useState, useEffect } from 'react';
import { skills as defaultSkills } from '../data/portfolio';

// Since defaultSkills has Lucide React components in the `icon` field, 
// we will strip them out to store safely in JSON.
const serializeSkills = (rawArray) => {
  return rawArray.map(skill => {
    // If it's the raw default data, extract name and tech
    return { name: skill.name, tech: skill.tech };
  });
};

const initializeStorage = () => {
  const stored = localStorage.getItem('portfolio_skills');
  if (stored) {
    return JSON.parse(stored);
  } else {
    const cleanData = serializeSkills(defaultSkills);
    localStorage.setItem('portfolio_skills', JSON.stringify(cleanData));
    return cleanData;
  }
};

export function useSkills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    setSkills(initializeStorage());
  }, []);

  const persistChanges = (newArr) => {
    setSkills(newArr);
    localStorage.setItem('portfolio_skills', JSON.stringify(newArr));
    window.dispatchEvent(new Event('skills_updated'));
  };

  const addSkillCategory = (categoryObj) => {
    // { name: "Backend", tech: ["Node", "Express"] }
    persistChanges([...skills, categoryObj]);
  };

  const updateSkillCategory = (oldName, newObj) => {
    const updatedArray = skills.map(s => s.name === oldName ? newObj : s);
    persistChanges(updatedArray);
  };

  const deleteSkillCategory = (categoryName) => {
    const reducedArray = skills.filter(s => s.name !== categoryName);
    persistChanges(reducedArray);
  };

  useEffect(() => {
    const handleStorageUpdate = () => {
       setSkills(JSON.parse(localStorage.getItem('portfolio_skills')));
    };
    
    window.addEventListener('skills_updated', handleStorageUpdate);
    return () => window.removeEventListener('skills_updated', handleStorageUpdate);
  }, []);

  return { skills, addSkillCategory, updateSkillCategory, deleteSkillCategory };
}
