import { BookOpen, Download, FileText, GraduationCap, MapPin } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import { Section } from '@/components/site/Section';
import { Reveal } from '@/components/site/Reveal';
import { SmartImage } from '@/components/site/SmartImage';

function EducationItem({ Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-accent/20 bg-accent-soft text-accent">
        <Icon size={18} />
      </span>
      <div className="pt-0.5">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-sm leading-snug text-muted">{value}</p>
      </div>
    </div>
  );
}

export function About({ about }) {
  const hasEducation = about.university || about.school;

  return (
    <Section id="about" eyebrow="Introduction" title="About Me">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,480px)_1fr] lg:gap-16">
        {/* Profile card */}
        <Reveal className="group relative">
          <div className="absolute -inset-px rounded-[1.75rem] bg-gradient-to-br from-accent/50 via-sky-400/20 to-transparent opacity-60 blur-sm transition duration-500 group-hover:opacity-100" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-xl shadow-black/5">
            {/* Cover */}
            {/* 4:1 matches a LinkedIn-style banner so baked-in text is never cropped */}
            <div className="relative aspect-[4/1] min-h-24 bg-gradient-to-r from-blue-400 via-accent to-sky-500">
              {about.coverImage && (
                <SmartImage src={about.coverImage} alt="" fill sizes="480px" className="object-cover object-right" />
              )}
            </div>

            <div className="relative px-6 pb-7 sm:px-8">
              {/* Avatar overlapping the cover */}
              <div className="absolute -top-14 left-1/2 h-36 w-36 -translate-x-1/2 overflow-hidden rounded-full border-[5px] border-card bg-card-hover shadow-lg ring-2 ring-accent/40">
                {about.profileImage && (
                  <SmartImage src={about.profileImage} alt={about.name || 'Profile'} fill sizes="144px" className="object-cover" />
                )}
              </div>

              <div className="pt-[6.5rem] text-center">
                <h3 className="text-2xl font-bold tracking-tight">{about.name}</h3>
                {about.role && <p className="mt-1 text-muted">{about.role}</p>}
                {about.location && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
                    <MapPin size={15} className="text-accent" /> {about.location}
                  </p>
                )}
              </div>

              {about.linkedin && (
                <a
                  href={about.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn mt-6 w-full border-2 border-accent py-3 font-semibold text-accent hover:bg-accent hover:text-accent-fg"
                >
                  <FaLinkedin size={18} /> Connect
                </a>
              )}

              {hasEducation && (
                <div className="mt-7 border-t border-border pt-6">
                  <h4 className="mb-5 flex items-center gap-2 font-semibold">
                    <GraduationCap size={18} className="text-accent" /> Educational Background
                  </h4>
                  <div className="space-y-4">
                    {about.university && <EducationItem Icon={GraduationCap} label="University" value={about.university} />}
                    {about.school && <EducationItem Icon={BookOpen} label="High School" value={about.school} />}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* Bio + details */}
        <Reveal delay={0.1} className="lg:pt-10">
          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Driven by <span className="text-accent">passion</span> &amp; purpose.
          </h3>
          <p className="mt-5 whitespace-pre-line text-lg leading-relaxed text-muted">
            {about.longBio || 'Bio coming soon.'}
          </p>

          <div className="mt-8 border-t border-border pt-7">
            <h4 className="font-semibold">Availability</h4>
            <p className="mt-2 flex items-center gap-2 font-medium text-emerald-500">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              Open to opportunities
            </p>
          </div>

          <div className="mt-7 border-t border-border pt-7">
            <h4 className="mb-4 font-semibold">Resume</h4>
            {about.resumeFile ? (
              <a
                href={about.resumeFile}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary rounded-xl px-6 py-3 font-semibold shadow-lg shadow-accent/25 hover:-translate-y-0.5"
              >
                <Download size={18} /> Download CV
              </a>
            ) : (
              <span className="btn cursor-not-allowed rounded-xl bg-card-hover px-6 py-3 font-semibold text-muted">
                <FileText size={18} /> CV Not Available
              </span>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
