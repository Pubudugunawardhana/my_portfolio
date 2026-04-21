import { useState, useEffect } from 'react';
import { 
  listenToProjectsFromFirebase, 
  addProjectToFirebase, 
  updateProjectInFirebase, 
  deleteProjectFromFirebase,
  checkAndSeedProjectsIntelligently
} from '../services/projectService';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Instantly check if we need to migrate raw static code into the empty Cloud.
    checkAndSeedProjectsIntelligently();

    // 2. Open the socket! Let Firebase aggressively push new DB rows down into this React state.
    const unsubscribe = listenToProjectsFromFirebase((liveData) => {
      setProjects(liveData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addProject = async (projectObj) => {
    // No longer generating a random Date ID. Firebase will securely assign an alphanumeric ID!
    await addProjectToFirebase(projectObj);
  };

  const editProject = async (id, updatedData) => {
    await updateProjectInFirebase(id, updatedData);
  };

  const deleteProject = async (id) => {
    await deleteProjectFromFirebase(id);
  };

  return { projects, isLoading, addProject, editProject, deleteProject };
}
