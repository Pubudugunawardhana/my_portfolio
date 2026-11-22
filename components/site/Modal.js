'use client';

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

// Dialog shell: dimmed backdrop, slide-up panel (a bottom sheet on phones),
// Esc / backdrop / ✕ to close, and page scrolling locked while open.
// Render it inside <AnimatePresence> so it animates out.
export function Modal({ onClose, labelledBy, maxWidth = 'max-w-3xl', children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className={`card relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-b-none sm:rounded-3xl ${maxWidth}`}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
        >
          <X size={16} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
