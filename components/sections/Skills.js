'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Layers } from 'lucide-react';
import { Section } from '@/components/site/Section';
import { Reveal } from '@/components/site/Reveal';
import { TechIcon, techColor } from '@/components/site/TechIcon';
import { EmptyState } from '@/components/site/EmptyState';

const ALL = 'All';
const COLLAPSED_ROWS = 2;
const EASE = [0.22, 1, 0.36, 1];

// Measure the grid: full height, height of the first N rows, and how many tiles sit below them.
function measure(list) {
  const tiles = [...list.children];
  const rowTops = [...new Set(tiles.map((t) => t.offsetTop))].sort((a, b) => a - b);
  const full = list.scrollHeight;
  if (rowTops.length <= COLLAPSED_ROWS) return { full, collapsed: full, hidden: 0 };

  const cutoff = rowTops[COLLAPSED_ROWS];
  const shown = tiles.filter((t) => t.offsetTop < cutoff);
  const last = shown[shown.length - 1];
  return { full, collapsed: last.offsetTop + last.offsetHeight, hidden: tiles.length - shown.length };
}

export function Skills({ skills }) {
  const [active, setActive] = useState(ALL);
  const [expanded, setExpanded] = useState(false);
  const [size, setSize] = useState(null);
  const listRef = useRef(null);
  const sectionRef = useRef(null);

  const tabs = [ALL, ...skills.map((g) => g.name)];

  // "All" shows every tech once, even if it appears in several categories.
  const items = useMemo(() => {
    const groups = active === ALL ? skills : skills.filter((g) => g.name === active);
    return [...new Set(groups.flatMap((g) => g.tech))];
  }, [skills, active]);

  // Re-measure whenever the grid reflows (resize, tab change, tiles animating in).
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(() => setSize(measure(list)));
    observer.observe(list);
    return () => observer.disconnect();
  }, [items]);

  const canCollapse = (size?.hidden ?? 0) > 0;
  const height = !size ? 'auto' : expanded || !canCollapse ? size.full : size.collapsed;

  const selectTab = (tab) => {
    setActive(tab);
    setExpanded(false);
  };

  const toggle = () => {
    if (expanded) sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setExpanded((e) => !e);
  };

  return (
    <Section id="skills" eyebrow="Expertise" title="My Skills" description="Technologies and tools I use to design, build and ship.">
      {skills.length === 0 ? (
        <EmptyState icon={Layers} title="Skills coming soon" />
      ) : (
        <div ref={sectionRef} className="scroll-mt-28">
          {/* Category tabs */}
          <Reveal className="no-scrollbar -mx-4 mb-10 overflow-x-auto px-4">
            <div role="tablist" aria-label="Skill categories" className="inline-flex gap-1 rounded-full border border-border bg-card p-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={active === tab}
                  onClick={() => selectTab(tab)}
                  className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5 ${
                    active === tab ? 'text-accent-fg' : 'text-muted hover:text-fg'
                  }`}
                >
                  {active === tab && (
                    <motion.span
                      layoutId="skill-tab"
                      className="absolute inset-0 rounded-full bg-accent shadow-lg shadow-accent/30"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative">{tab}</span>
                </button>
              ))}
            </div>
          </Reveal>

          {/* Logo tiles – the wrapper animates its height between 2 rows and all rows */}
          <motion.div
            className="relative -m-3 overflow-hidden p-3"
            initial={false}
            animate={{ height: typeof height === 'number' ? height + 24 : height }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <ul ref={listRef} className="relative grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
              <AnimatePresence mode="popLayout" initial={false}>
                {items.map((tech, i) => {
                  const color = techColor(tech) ?? 'var(--accent)';
                  return (
                    <motion.li
                      key={tech}
                      layout
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.3, ease: EASE, delay: Math.min(i * 0.02, 0.2) }}
                      style={{ '--brand': color }}
                      className="group card relative flex aspect-square flex-col items-center justify-center gap-2.5 overflow-hidden p-3 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--brand)_50%,transparent)] hover:shadow-[0_10px_40px_-10px_var(--brand)]"
                    >
                      {/* Brand-colored glow on hover */}
                      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,color-mix(in_srgb,var(--brand)_18%,transparent),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <TechIcon name={tech} className="relative h-8 w-8 transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10" />
                      <span className="relative text-center text-xs font-medium leading-tight sm:text-sm">{tech}</span>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>

            {/* Fade hint that more skills are hidden */}
            <motion.div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-bg via-bg/70 to-transparent"
              initial={false}
              animate={{ opacity: canCollapse && !expanded ? 1 : 0 }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>

          <AnimatePresence initial={false}>
            {canCollapse && (
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <button onClick={toggle} aria-expanded={expanded} className="btn-ghost">
                  {expanded ? 'Show less' : `Show ${size.hidden} more skills`}
                  <ChevronDown size={16} className={`transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Section>
  );
}
