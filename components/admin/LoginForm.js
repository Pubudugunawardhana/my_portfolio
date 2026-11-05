'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { loginWithGoogle, loginWithPassword } from '@/actions/auth';

export function LoginForm({ initialError }) {
  const [state, formAction, pending] = useActionState(loginWithPassword, null);
  const error = state?.error ?? initialError;

  return (
    <div className="card relative w-full max-w-sm p-8 shadow-2xl">
      <span className="mb-6 grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent"><Lock size={18} /></span>
      <h1 className="text-2xl font-semibold tracking-tight">Admin sign in</h1>
      <p className="mt-1 text-sm text-muted">Manage your portfolio content.</p>

      {error && <p role="alert" className="mt-5 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p>}

      <form action={loginWithGoogle} className="mt-6">
        <button type="submit" className="btn-ghost w-full py-3"><FcGoogle size={18} /> Continue with Google</button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

      <form action={formAction} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Email</span>
          <input name="email" type="email" required autoComplete="username" className="input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Password</span>
          <input name="password" type="password" required autoComplete="current-password" className="input" />
        </label>
        <button type="submit" disabled={pending} className="btn-primary w-full py-3">{pending ? 'Signing in…' : 'Sign in'}</button>
      </form>

      <Link href="/" className="mt-6 block text-center text-sm text-muted hover:text-fg">← Back to portfolio</Link>
    </div>
  );
}
