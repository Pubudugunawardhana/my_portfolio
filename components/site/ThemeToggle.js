'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle({ className = '' }) {
  const { resolvedTheme, setTheme } = useTheme();

  // Both icons render; CSS picks the right one, so there's no hydration flash.
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle color theme"
      className={`grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted transition hover:text-fg ${className}`}
    >
      <Sun size={16} className="hidden dark:block" />
      <Moon size={16} className="block dark:hidden" />
    </button>
  );
}
