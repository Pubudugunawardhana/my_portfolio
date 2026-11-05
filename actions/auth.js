'use server';

import { AuthError } from 'next-auth';
import { signIn, signOut } from '@/auth';

export async function loginWithPassword(_prevState, formData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/admin',
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: err.type === 'AccessDenied' ? 'This account is not allowed to access the admin panel.' : 'Invalid email or password.' };
    }
    throw err; // let Next.js handle the success redirect
  }
}

export async function loginWithGoogle() {
  await signIn('google', { redirectTo: '/admin' });
}

export async function logout() {
  await signOut({ redirectTo: '/login' });
}
