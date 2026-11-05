'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function PageHeader({ title, description, children }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function Field({ label, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

// Inline result banner for { ok, error } action results; success auto-hides.
export function ActionStatus({ result, successText = 'Saved' }) {
  const [dismissed, setDismissed] = useState(null);
  useEffect(() => {
    if (!result?.ok) return;
    const t = setTimeout(() => setDismissed(result), 3000);
    return () => clearTimeout(t);
  }, [result]);

  if (!result || dismissed === result) return null;
  return (
    <p
      role="status"
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm ${
        result.ok ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
      }`}
    >
      {result.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
      {result.ok ? successText : result.error}
    </p>
  );
}
