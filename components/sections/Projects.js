'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, FolderGit2, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { Section } from '@/components/site/Section';
import { Reveal } from '@/components/site/Reveal';
import { SmartImage } from '@/components/site/SmartImage';
import { Slideshow, projectImages } from '@/components/site/Slideshow';
import { EmptyState } from '@/components/site/EmptyState';

// Newest projects get the large showcase rows; the rest go in a compact grid.
const FEATURED_COUNT = 3;
const MORE_COUNT = 6;

function ProjectLinks({ project, size = 'sm' }) {
  const cls = size === 'lg' ? 'btn-ghost flex-1 py-3' : 'text-muted transition hover:text-fg';
  return (
    <>
      {project.githubUrl && (
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={cls} aria-label="Source code" onClick={(e) => e.stopPropagation()}>
          <FaGithub size={size === 'lg' ? 16 : 18} /> {size === 'lg' && 'Source code'}
        </a>
      )}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={size === 'lg' ? 'btn-primary flex-1 py-3' : cls}
          aria-label="Live demo"
          onClick={(e) => e.stopPropagation()}
        >
          {size === 'lg' && 'Live demo'} <ArrowUpRight size={18} />
        </a>
      )}
    </>
  );
}

function ProjectModal({ project, onClose }) {
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
      aria-labelledby="project-title"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="card relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-b-none sm:rounded-3xl"
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
        {project.image && (
          <Slideshow
            images={projectImages(project)}
            alt={project.title}
            sizes="768px"
            interval={4000}
            className="aspect-video w-full shrink-0 overflow-hidden bg-card-hover"
          />
        )}
        <div className="overflow-y-auto p-6 sm:p-9">
          <h3 id="project-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">{project.title}</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">{t}</span>
            ))}
          </div>
          <p className="mt-6 whitespace-pre-wrap leading-relaxed text-muted">{project.description}</p>
          {(project.githubUrl || project.liveUrl) && (
            <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
              <ProjectLinks project={project} size="lg" />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectRow({ project, index, onOpen }) {
  const reversed = index % 2 === 1;
  const images = projectImages(project);
  return (
    <Reveal>
      <article className="group grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Screenshots in a browser-window frame (click opens details; "Read more" is the keyboard path) */}
        <div
          onClick={onOpen}
          className={`card relative cursor-pointer overflow-hidden p-2 shadow-xl shadow-black/5 transition duration-500 group-hover:-translate-y-1 group-hover:border-accent/40 group-hover:shadow-2xl group-hover:shadow-accent/15 ${reversed ? 'lg:order-2' : ''}`}
        >
          <div className="flex items-center gap-1.5 px-2 pb-2 pt-1" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          {images.length > 0 ? (
            <Slideshow
              images={images}
              alt={project.title}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="aspect-[16/10] overflow-hidden rounded-xl bg-card-hover"
            />
          ) : (
            <div className="grid aspect-[16/10] place-items-center rounded-xl bg-card-hover"><FolderGit2 className="h-12 w-12 text-muted/40" /></div>
          )}
        </div>

        {/* Details */}
        <div className={reversed ? 'lg:order-1' : ''}>
          <p className="font-mono text-sm text-accent">
            {String(index + 1).padStart(2, '0')} <span className="text-muted">— {index === 0 ? 'Featured' : 'Project'}</span>
          </p>
          <h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{project.title}</h3>
          <p className="mt-4 line-clamp-3 whitespace-pre-line leading-relaxed text-muted">{project.description}</p>

          {project.tech.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <li key={t} className="rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted">{t}</li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={onOpen} className="btn-primary px-5">
              Read more <ArrowUpRight size={16} />
            </button>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost px-5">
                <FaGithub size={16} /> Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn px-3 text-muted hover:text-fg">
                Live demo <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

// Compact card for the "More projects" grid.
function ProjectCard({ project, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="card group flex h-full flex-col overflow-hidden text-left transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10"
    >
      <span className="relative block aspect-[16/9] w-full overflow-hidden bg-card-hover">
        {project.image ? (
          <SmartImage
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="grid h-full place-items-center"><FolderGit2 className="h-10 w-10 text-muted/40" /></span>
        )}
      </span>
      <span className="flex flex-1 flex-col p-5">
        <span className="flex items-start justify-between gap-3">
          <span className="font-semibold leading-snug">{project.title}</span>
          <ArrowUpRight size={18} className="shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </span>
        <span className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {project.tech.slice(0, 3).map((t) => (
            <span key={t} className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-muted">{t}</span>
          ))}
          {project.tech.length > 3 && <span className="px-1 py-0.5 font-mono text-[11px] text-muted">+{project.tech.length - 3}</span>}
        </span>
      </span>
    </button>
  );
}

export function Projects({ projects }) {
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const featured = projects.slice(0, FEATURED_COUNT);
  const more = projects.slice(FEATURED_COUNT);
  const visibleMore = showAll ? more : more.slice(0, MORE_COUNT);

  return (
    <Section id="projects" eyebrow="Work" title="Selected projects" description="Things I've designed and built.">
      {projects.length === 0 ? (
        <EmptyState icon={FolderGit2} title="No projects yet">Add some from the admin panel.</EmptyState>
      ) : (
        <>
          {/* Latest projects as large showcase rows */}
          <div className="space-y-16 sm:space-y-20">
            {featured.map((project, i) => (
              <ProjectRow key={project._id} project={project} index={i} onOpen={() => setSelected(project)} />
            ))}
          </div>

          {/* Everything else as a compact grid */}
          {more.length > 0 && (
            <div className="mt-20 sm:mt-24">
              <Reveal className="mb-8 flex items-center gap-4">
                <h3 className="text-xl font-semibold tracking-tight">More projects</h3>
                <span className="h-px flex-1 bg-border" />
                <span className="font-mono text-sm text-muted">{more.length}</span>
              </Reveal>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visibleMore.map((project, i) => (
                  <Reveal key={project._id} delay={0.05 * (i % 3)}>
                    <ProjectCard project={project} onOpen={() => setSelected(project)} />
                  </Reveal>
                ))}
              </div>
              {more.length > MORE_COUNT && (
                <div className="mt-10 text-center">
                  <button onClick={() => setShowAll((s) => !s)} className="btn-ghost">
                    {showAll ? 'Show less' : `Show all ${more.length} more projects`}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </Section>
  );
}
