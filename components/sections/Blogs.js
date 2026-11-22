'use client';

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { ArrowUpRight, BookOpen, Clock } from 'lucide-react';
import { Section } from '@/components/site/Section';
import { SmartImage } from '@/components/site/SmartImage';
import { Carousel } from '@/components/site/Carousel';
import { EmptyState } from '@/components/site/EmptyState';
import { Modal } from '@/components/site/Modal';

// UTC so the server render and the browser always agree on the day.
const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }) : 'Recently';

function ArticleModal({ post, onClose }) {
  return (
    <Modal onClose={onClose} labelledBy="article-title">
      {post.thumbnail && (
        <div className="relative aspect-[16/9] w-full shrink-0 bg-card-hover">
          <SmartImage src={post.thumbnail} alt="" fill sizes="768px" className="object-cover" />
        </div>
      )}
      <div className="overflow-y-auto p-6 sm:p-9">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
          <time dateTime={post.pubDate ?? undefined}>{formatDate(post.pubDate)}</time>
          <span className="inline-flex items-center gap-1"><Clock size={12} /> {post.readingMinutes} min read</span>
        </p>
        <h3 id="article-title" className="mt-2 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{post.title}</h3>
        {post.categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.categories.map((c) => (
              <span key={c} className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">{c}</span>
            ))}
          </div>
        )}
        <div className="relative mt-6">
          <p className="whitespace-pre-line leading-relaxed text-muted">{post.excerpt}</p>
          {/* Fade the preview out to hint there's more on Medium */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
        </div>
        <div className="mt-6 border-t border-border pt-6">
          <a href={post.link} target="_blank" rel="noopener noreferrer" className="btn-primary py-3">
            Read full article on Medium <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </Modal>
  );
}

export function Blogs({ posts, mediumUrl }) {
  const [selected, setSelected] = useState(null);

  return (
    <Section id="blogs" eyebrow="Writing" title="Latest articles" description="Notes and write-ups I publish on Medium.">
      {posts.length === 0 ? (
        <EmptyState icon={BookOpen} title="No articles found yet">Check back soon!</EmptyState>
      ) : (
        <Carousel
          label="Articles"
          autoPlay={4000}
          footer={
            mediumUrl && (
              <a href={mediumUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                All articles <ArrowUpRight size={14} />
              </a>
            )
          }
        >
          {posts.map((post) => (
            <article
              key={post.link}
              onClick={() => setSelected(post)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSelected(post))}
              tabIndex={0}
              role="button"
              aria-label={`Open ${post.title}`}
              className="card group flex h-[32rem] w-[85%] shrink-0 cursor-pointer snap-start flex-col overflow-hidden transition duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-card-hover">
                {post.thumbnail ? (
                  <SmartImage src={post.thumbnail} alt="" fill sizes="(min-width: 1024px) 33vw, 85vw" className="object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="grid h-full place-items-center"><BookOpen className="h-10 w-10 text-muted/40" /></div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-2 font-mono text-xs text-muted">
                  <time dateTime={post.pubDate ?? undefined}>{formatDate(post.pubDate)}</time>
                  {post.categories[0] && <span className="truncate rounded-full bg-accent-soft px-2 py-0.5 text-accent">{post.categories[0]}</span>}
                </div>
                <h3 className="mt-3 line-clamp-2 font-semibold leading-snug">{post.title}</h3>
                <p className="mt-2 line-clamp-6 text-sm leading-relaxed text-muted">{post.description}</p>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-auto inline-flex items-center gap-1 self-start pt-5 text-sm font-medium transition hover:text-accent"
                >
                  Read on Medium <ArrowUpRight size={14} />
                </a>
              </div>
            </article>
          ))}
        </Carousel>
      )}

      <AnimatePresence>{selected && <ArticleModal post={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </Section>
  );
}
