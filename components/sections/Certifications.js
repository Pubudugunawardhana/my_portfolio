'use client';

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Award, ArrowUpRight, FileText } from 'lucide-react';
import { Section } from '@/components/site/Section';
import { SmartImage } from '@/components/site/SmartImage';
import { Carousel } from '@/components/site/Carousel';
import { EmptyState } from '@/components/site/EmptyState';
import { ALL, CategoryTabs, buildTabs, filterByTab } from '@/components/site/CategoryTabs';
import { Modal } from '@/components/site/Modal';
import { categoryName, itemCategory } from '@/lib/projectCategories';

function CertificationModal({ cert, categories, onClose }) {
  const category = categories.length > 1 ? categoryName(itemCategory(cert, categories), categories) : '';
  return (
    <Modal onClose={onClose} labelledBy="certification-title">
      <div className="relative aspect-[16/10] w-full shrink-0 bg-card-hover">
        {cert.image ? (
          <SmartImage src={cert.image} alt={cert.title} fill sizes="768px" className="object-contain p-4 sm:p-6" />
        ) : (
          <div className="grid h-full place-items-center"><Award className="h-16 w-16 text-muted/40" /></div>
        )}
      </div>
      <div className="overflow-y-auto p-6 sm:p-9">
        <p className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
          {cert.date}
          {category && <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-sans font-medium text-accent">{category}</span>}
        </p>
        <h3 id="certification-title" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{cert.title}</h3>
        <p className="mt-1 text-accent">{cert.issuer}</p>
        {cert.description && <p className="mt-6 whitespace-pre-wrap leading-relaxed text-muted">{cert.description}</p>}
        {(cert.credentialUrl || cert.pdfUrl) && (
          <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
            {cert.credentialUrl && (
              <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="btn-primary py-3">
                Verify credential <ArrowUpRight size={16} />
              </a>
            )}
            {cert.pdfUrl && (
              <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost py-3">
                <FileText size={16} /> View certificate (PDF)
              </a>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export function Certifications({ certifications, categories = [] }) {
  const [active, setActive] = useState(ALL);
  const [selected, setSelected] = useState(null);
  const tabs = buildTabs(certifications, categories);
  const shown = filterByTab(certifications, categories, active);

  return (
    <Section id="certifications" eyebrow="Credentials" title="Certifications">
      {certifications.length === 0 ? (
        <EmptyState icon={Award} title="No certifications yet">Check back later for updated credentials.</EmptyState>
      ) : (
        <>
          {tabs.length > 2 && (
            <CategoryTabs tabs={tabs} active={active} onChange={setActive} label="Certification categories" layoutId="certification-tab" />
          )}
          {/* Keyed by tab so the carousel starts from the first card after switching */}
          <Carousel key={active} label="Certifications" autoPlay={3500}>
            {shown.map((cert) => (
              <article
                key={cert._id}
                onClick={() => setSelected(cert)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSelected(cert))}
                tabIndex={0}
                role="button"
                aria-label={`Open ${cert.title}`}
                className="card group flex h-[32rem] w-[85%] shrink-0 cursor-pointer snap-start flex-col overflow-hidden transition duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
              >
                <div className="relative aspect-[4/3] bg-card-hover">
                  {cert.image ? (
                    <SmartImage src={cert.image} alt={cert.title} fill sizes="(min-width: 1024px) 33vw, 85vw" className="object-contain p-4 transition duration-500 group-hover:scale-[1.03]" />
                  ) : (
                    <div className="grid h-full place-items-center"><Award className="h-12 w-12 text-muted/40" /></div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-mono text-xs text-muted">{cert.date}</p>
                  <h3 className="mt-1.5 line-clamp-2 font-semibold leading-snug">{cert.title}</h3>
                  <p className="mt-1 text-sm text-accent">{cert.issuer}</p>
                  {cert.description && <p className="mt-3 line-clamp-3 text-sm text-muted">{cert.description}</p>}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium transition hover:text-accent"
                    >
                      Verify credential <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </Carousel>
        </>
      )}

      <AnimatePresence>
        {selected && <CertificationModal cert={selected} categories={categories} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </Section>
  );
}
