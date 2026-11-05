import { ArrowUpRight, BookOpen } from 'lucide-react';
import { Section } from '@/components/site/Section';
import { SmartImage } from '@/components/site/SmartImage';
import { Carousel } from '@/components/site/Carousel';
import { EmptyState } from '@/components/site/EmptyState';

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently';

export function Blogs({ posts, mediumUrl }) {
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
            <a
              key={post.link}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="card group flex h-[32rem] w-[85%] shrink-0 snap-start flex-col overflow-hidden transition hover:border-accent/40 sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
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
                <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium transition group-hover:text-accent">
                  Read on Medium <ArrowUpRight size={14} />
                </span>
              </div>
            </a>
          ))}
        </Carousel>
      )}
    </Section>
  );
}
