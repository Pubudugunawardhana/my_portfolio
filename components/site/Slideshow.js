'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SmartImage } from './SmartImage';

// Cross-fading image slideshow with dot navigation. Auto-advances every
// `interval` ms, pausing on hover and when the user prefers reduced motion.
export function Slideshow({ images, alt = '', sizes, interval = 3500, className = '', imageClassName = 'object-cover object-top' }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % count);
    }, interval);
    return () => clearInterval(id);
  }, [count, paused, interval]);

  if (count === 0) return null;
  const current = index % count;

  return (
    <div className={`relative ${className}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <AnimatePresence initial={false}>
        <motion.div
          key={images[current]}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <SmartImage src={images[current]} alt={`${alt} – screenshot ${current + 1} of ${count}`} fill sizes={sizes} className={imageClassName} />
        </motion.div>
      </AnimatePresence>

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Show screenshot ${i + 1}`}
              aria-current={i === current}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              className={`h-1.5 rounded-full bg-white shadow transition-all duration-300 ${i === current ? 'w-6 opacity-100' : 'w-1.5 opacity-60 hover:opacity-90'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Cover image first, then any extra gallery screenshots (deduplicated).
export const projectImages = (project) => [...new Set([project.image, ...(project.gallery ?? [])].filter(Boolean))];
