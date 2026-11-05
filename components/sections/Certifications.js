import { Award, ArrowUpRight } from 'lucide-react';
import { Section } from '@/components/site/Section';
import { SmartImage } from '@/components/site/SmartImage';
import { Carousel } from '@/components/site/Carousel';
import { EmptyState } from '@/components/site/EmptyState';

export function Certifications({ certifications }) {
  return (
    <Section id="certifications" eyebrow="Credentials" title="Certifications">
      {certifications.length === 0 ? (
        <EmptyState icon={Award} title="No certifications yet">Check back later for updated credentials.</EmptyState>
      ) : (
        <Carousel label="Certifications" autoPlay={3500}>
          {certifications.map((cert) => (
            <article
              key={cert._id}
              className="card group flex h-[32rem] w-[85%] shrink-0 snap-start flex-col overflow-hidden sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
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
                    className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium transition hover:text-accent"
                  >
                    Verify credential <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </Carousel>
      )}
    </Section>
  );
}
