'use client';

import { motion, useReducedMotion } from 'motion/react';

// Fade-and-rise wrapper for content entering the viewport.
export function Reveal({ children, delay = 0, className, as = 'div' }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </Tag>
  );
}
