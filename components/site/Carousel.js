'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Horizontal snap-scrolling row with prev/next buttons.
// With `autoPlay` (ms) it advances one card at a time and loops, pausing while
// hovered/touched/focused, off-screen, in a background tab, or with reduced motion.
export function Carousel({ children, label, autoPlay = 0, footer = null }) {
  const ref = useRef(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);

  const step = useCallback((dir) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const amount = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const atStart = el.scrollLeft <= 4;

    if (dir > 0 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir < 0 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    else el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }, []);

  // Only run while the carousel is on screen.
  useEffect(() => {
    if (!autoPlay || !ref.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [autoPlay]);

  useEffect(() => {
    if (!autoPlay || paused || !visible) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (!document.hidden) step(1);
    }, autoPlay);
    return () => clearInterval(id);
  }, [autoPlay, paused, visible, step]);

  const pause = () => setPaused(true);
  const resume = () => setPaused(false);

  return (
    <div
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onFocus={pause}
      onBlur={resume}
    >
      <div ref={ref} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2" aria-label={label}>
        {children}
      </div>
      <div className="mt-6 flex items-center justify-end gap-2">
        {footer && <div className="mr-auto">{footer}</div>}
        <button onClick={() => step(-1)} aria-label="Previous" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-muted transition hover:text-fg">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => step(1)} aria-label="Next" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-muted transition hover:text-fg">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
