// src/services/authService.js
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export async function loginAdmin(email, password) {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  
  // Save JWT token
  localStorage.setItem('adminToken', data.token);
  return data;
}

export async function loginWithGoogleAdmin() {
  // Sign in with Firebase (Google)
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();

  // Send the token to our MongoDB backend
  const res = await fetch('http://localhost:5000/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken })
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Google Login failed on backend');
  
  // Save JWT token from our backend
  localStorage.setItem('adminToken', data.token);
  return data;
}

export function logoutUser() {
  localStorage.removeItem('adminToken');
  return Promise.resolve();
}

export const logoutAdmin = logoutUser;

export function subscribeToAuthChanges(callback) {
  // Mock Firebase auth listener with JWT presence
  const token = localStorage.getItem('adminToken');
  if (token) {
    callback({ uid: 'admin', email: 'admin@portfolio' });
  } else {
    callback(null);
  }
  
  // Return dummy unsubscribe
  return () => {};
}
