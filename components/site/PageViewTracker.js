'use client';

import { useEffect } from 'react';

// Counts one view per browser session.
export function PageViewTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem('pv')) return;
      sessionStorage.setItem('pv', '1');
    } catch {
      // storage blocked – still count the view
    }
    fetch('/api/analytics', { method: 'POST', keepalive: true }).catch(() => {});
  }, []);
  return null;
}
