'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, ChevronDown, FolderGit2, Layers } from 'lucide-react';
import { Section } from '@/components/site/Section';
import { Reveal } from '@/components/site/Reveal';
import { TechIcon, techColor } from '@/components/site/TechIcon';
import { EmptyState } from '@/components/site/EmptyState';
import { Modal } from '@/components/site/Modal';
import { SmartImage } from '@/components/site/SmartImage';
import { ProjectModal } from '@/components/sections/Projects';
import { projectsUsing, sameTech } from '@/lib/techMatch';

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

// Details for one skill: its categories and the projects built with it.
// Clicking a project swaps in that project's own modal.
function SkillModal({ tech, skills, projects, onOpenProject, onClose }) {
  const groups = skills.filter((g) => g.tech.some((t) => sameTech(t, tech))).map((g) => g.name);
  const used = projectsUsing(tech, projects);
  const color = techColor(tech) ?? 'var(--accent)';

  return (
    <Modal onClose={onClose} labelledBy="skill-title" maxWidth="max-w-xl">
      <div
        className="flex items-center gap-5 border-b border-border p-6 pr-16 sm:p-8 sm:pr-16"
        style={{ background: `radial-gradient(circle at 15% 50%, color-mix(in srgb, ${color} 16%, transparent), transparent 65%)` }}
      >
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-border bg-card shadow-sm">
          <TechIcon name={tech} className="h-9 w-9" />
        </span>
        <div className="min-w-0">
          <h3 id="skill-title" className="text-2xl font-semibold tracking-tight">{tech}</h3>
          {groups.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {groups.map((g) => (
                <span key={g} className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">{g}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-y-auto p-6 sm:p-8">
        <p className="mb-4 text-sm font-medium text-muted">
          {used.length > 0 ? `Used in ${used.length} project${used.length === 1 ? '' : 's'}` : 'Not featured in a project here yet.'}
        </p>
        {used.length > 0 && (
          <ul className="space-y-3">
            {used.map((p) => (
              <li key={p._id}>
                <button
                  type="button"
                  onClick={() => onOpenProject(p)}
                  className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-bg p-3 text-left transition hover:border-accent/40 hover:bg-card-hover"
                >
                  <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-card-hover">
                    {p.image ? (
                      <SmartImage src={p.image} alt="" fill sizes="80px" className="object-cover object-top" />
                    ) : (
                      <FolderGit2 className="absolute inset-0 m-auto h-5 w-5 text-muted/50" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 font-medium leading-snug">{p.title}</span>
                  </span>
                  <ArrowUpRight size={18} className="shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

export function Skills({ skills, projects = [] }) {
  const [active, setActive] = useState(ALL);
  const [expanded, setExpanded] = useState(false);
  const [openSkill, setOpenSkill] = useState(null);
  const [openProject, setOpenProject] = useState(null);
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
                      onClick={() => setOpenSkill(tech)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setOpenSkill(tech))}
                      tabIndex={0}
                      role="button"
                      aria-label={`${tech} – see related projects`}
                      className="group card relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-2.5 overflow-hidden p-3 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--brand)_50%,transparent)] hover:shadow-[0_10px_40px_-10px_var(--brand)]"
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

      <AnimatePresence mode="wait">
        {openProject ? (
          <ProjectModal key="project" project={openProject} onClose={() => setOpenProject(null)} />
        ) : (
          openSkill && (
            <SkillModal
              key="skill"
              tech={openSkill}
              skills={skills}
              projects={projects}
              onClose={() => setOpenSkill(null)}
              onOpenProject={(p) => {
                setOpenSkill(null);
                setOpenProject(p);
              }}
            />
          )
        )}
      </AnimatePresence>
    </Section>
  );
}
