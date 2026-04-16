import { useState, useEffect } from 'react';
import { projects as defaultProjects } from '../data/portfolio';

// Initial check to safely seed localStorage if it is empty
const initializeStorage = () => {
  const stored = localStorage.getItem('portfolio_projects');
  if (stored) {
    return JSON.parse(stored);
  } else {
    // We add unique IDs to the mock data for edit/delete functions to work securely
    const seeded = defaultProjects.map((p, index) => ({ ...p, id: Date.now() + index }));
    localStorage.setItem('portfolio_projects', JSON.stringify(seeded));
    return seeded;
  }
};

export function useProjects() {
  const [projects, setProjects] = useState([]);

  // Load from storage immediately on mount
  useEffect(() => {
    setProjects(initializeStorage());
  }, []);

  // Utility definition to save both state and persistent browser storage
  const persistChanges = (newArr) => {
    setProjects(newArr);
    localStorage.setItem('portfolio_projects', JSON.stringify(newArr));
    
    // Dispatch a custom window event so other components (like the public site) know immediately
    window.dispatchEvent(new Event('projects_updated'));
  };

  const addProject = (project) => {
    // Spread in the user's object and slap a unique timestamp ID on it
    const newRecord = { ...project, id: Date.now() };
    persistChanges([...projects, newRecord]);
  };

  const editProject = (id, updatedData) => {
    const updatedArray = projects.map(p => p.id === id ? { ...p, ...updatedData } : p);
    persistChanges(updatedArray);
  };

  const deleteProject = (id) => {
    const reducedArray = projects.filter(p => p.id !== id);
    persistChanges(reducedArray);
  };

  // Allow the hook to subscribe to storage changes across the app for real-time live sync
  useEffect(() => {
    const handleStorageUpdate = () => {
       setProjects(JSON.parse(localStorage.getItem('portfolio_projects')));
    };
    
    window.addEventListener('projects_updated', handleStorageUpdate);
    return () => window.removeEventListener('projects_updated', handleStorageUpdate);
  }, []);

  return { projects, addProject, editProject, deleteProject };
}
