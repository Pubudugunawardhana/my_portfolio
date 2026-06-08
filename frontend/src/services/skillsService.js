// src/services/skillsService.js

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/skills' : '/api/skills';

const getHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export async function getSkillsFromFirebase() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch skills');
  const data = await res.json();
  return data.map(s => ({ ...s, id: s._id }));
}

export async function addSkillToFirebase(skillData) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(skillData)
  });
  if (!res.ok) throw new Error('Failed to add skill');
  const data = await res.json();
  return data._id;
}

export const addOrUpdateSkillInFirebase = addSkillToFirebase;
export const checkAndSeedSkillsIntelligently = async () => {};

export async function deleteSkillFromFirebase(skillId) {
  const res = await fetch(`${API_URL}/${skillId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete skill');
}

export function listenToSkillsFromFirebase(callback) {
  getSkillsFromFirebase().then(callback).catch(err => console.error(err));
  return () => {};
}
