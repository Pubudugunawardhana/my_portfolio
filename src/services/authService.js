import { signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const googleProvider = new GoogleAuthProvider();
// Replace this with your exact Google Email to prevent strangers from logging in!
const ALLOWED_ADMIN_EMAIL = "pubudugunawardhana23@gmail.com";

export async function loginAdmin(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function loginWithGoogleAdmin() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // SECURITY CHECK: Ensure ONLY the admin email is allowed to access the dashboard
    if (result.user.email !== ALLOWED_ADMIN_EMAIL) {
      await signOut(auth); // Immediately kick them out
      throw new Error("UNAUTHORIZED_EMAIL");
    }
    
    return result.user;
  } catch (error) {
    console.error("Google Login failed:", error);
    throw error;
  }
}

export async function logoutAdmin() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}

export function subscribeToAuthChanges(callback) {
  // onAuthStateChanged returns an unsubscribe function
  return onAuthStateChanged(auth, callback);
}
