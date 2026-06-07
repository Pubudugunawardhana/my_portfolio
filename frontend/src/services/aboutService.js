// src/services/aboutService.js

const API_URL = 'http://localhost:5000/api/about';

const getHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export async function getAboutFromFirebase() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch about data');
  return await res.json();
}

export async function updateAboutInFirebase(data) {
  const res = await fetch(API_URL, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update about data');
}

export function listenToAboutFromFirebase(callback) {
  getAboutFromFirebase().then(callback).catch(err => console.error(err));
  return () => {};
}
