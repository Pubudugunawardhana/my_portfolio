// src/services/certificationService.js

const API_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/certifications' : '/api/certifications';

const getHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export async function getCertificationsFromFirebase() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch certifications');
  const data = await res.json();
  return data.map(c => ({ ...c, id: c._id }));
}

export async function addCertificationToFirebase(certData) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(certData)
  });
  if (!res.ok) throw new Error('Failed to add certification');
  const data = await res.json();
  return data._id;
}

export async function updateCertificationInFirebase(certId, updatedData) {
  const res = await fetch(`${API_URL}/${certId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updatedData)
  });
  if (!res.ok) throw new Error('Failed to update certification');
}

export async function deleteCertificationFromFirebase(certId) {
  const res = await fetch(`${API_URL}/${certId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete certification');
}

export function listenToCertificationsFromFirebase(callback) {
  getCertificationsFromFirebase().then(callback).catch(err => console.error(err));
  return () => {};
}
