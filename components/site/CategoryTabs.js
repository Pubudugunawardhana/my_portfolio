'use client';

import { motion } from 'motion/react';
import { itemCategory } from '@/lib/projectCategories';
import { Reveal } from './Reveal';

export const ALL = 'all';

// "All" plus one tab per category that has items, each with its count.
export function buildTabs(items, categories) {
  return [
    { value: ALL, label: 'All', count: items.length },
    ...categories
      .map((c) => ({ value: c.key, label: c.name, count: items.filter((i) => itemCategory(i, categories) === c.key).length }))
      .filter((c) => c.count > 0),
  ];
}

export const filterByTab = (items, categories, active) =>
  active === ALL ? items : items.filter((i) => itemCategory(i, categories) === active);

// Pill-style tab bar. Hidden by the caller when there is only one real category.
export function CategoryTabs({ tabs, active, onChange, label, layoutId }) {
  return (
    <Reveal className="no-scrollbar -mx-4 mb-12 overflow-x-auto px-4">
      <div role="tablist" aria-label={label} className="inline-flex gap-1 rounded-full border border-border bg-card p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active === tab.value}
            onClick={() => onChange(tab.value)}
            className={`relative flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5 ${
              active === tab.value ? 'text-accent-fg' : 'text-muted hover:text-fg'
            }`}
          >
            {active === tab.value && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-accent shadow-lg shadow-accent/30"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative">{tab.label}</span>
            <span className={`relative font-mono text-xs ${active === tab.value ? 'text-accent-fg/80' : 'text-muted/70'}`}>{tab.count}</span>
          </button>
        ))}
      </div>
    </Reveal>
  );
}
