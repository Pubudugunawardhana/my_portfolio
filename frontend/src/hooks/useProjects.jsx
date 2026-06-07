import { useState, useEffect, useCallback } from 'react';
import { 
  listenToProjectsFromFirebase, 
  addProjectToFirebase, 
  updateProjectInFirebase, 
  deleteProjectFromFirebase,
  getProjectsFromFirebase
} from '../services/projectService';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await getProjectsFromFirebase();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    // Simulate real-time by re-fetching when user switches tabs back
    window.addEventListener('focus', fetchProjects);
    return () => window.removeEventListener('focus', fetchProjects);
  }, [fetchProjects]);

  const addProject = async (projectObj) => {
    await addProjectToFirebase(projectObj);
    fetchProjects(); // Immediate UI update
  };

  const editProject = async (id, updatedData) => {
    await updateProjectInFirebase(id, updatedData);
    fetchProjects(); // Immediate UI update
  };

  const deleteProject = async (id) => {
    await deleteProjectFromFirebase(id);
    fetchProjects(); // Immediate UI update
  };

  return { projects, isLoading, addProject, editProject, deleteProject };
}
