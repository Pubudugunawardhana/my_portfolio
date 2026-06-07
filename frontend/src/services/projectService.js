// src/services/projectService.js

const API_URL = 'http://localhost:5000/api/projects';

const getHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export async function getProjectsFromFirebase() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch projects');
  const data = await res.json();
  // Map _id to id for frontend compatibility
  return data.map(p => ({ ...p, id: p._id }));
}

export async function addProjectToFirebase(projectData) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(projectData)
  });
  if (!res.ok) throw new Error('Failed to add project');
  const data = await res.json();
  return data._id;
}

export async function updateProjectInFirebase(projectId, updatedData) {
  const res = await fetch(`${API_URL}/${projectId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updatedData)
  });
  if (!res.ok) throw new Error('Failed to update project');
}

export async function deleteProjectFromFirebase(projectId) {
  const res = await fetch(`${API_URL}/${projectId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete project');
}

export function listenToProjectsFromFirebase(callback) {
  // Replace onSnapshot with a simple initial fetch
  // In a real app, you might use React Query or SWR. For now, just fetch once.
  getProjectsFromFirebase().then(callback).catch(err => console.error(err));
  return () => {}; // Dummy unsubscribe
}

export const checkAndSeedProjectsIntelligently = async () => {};
