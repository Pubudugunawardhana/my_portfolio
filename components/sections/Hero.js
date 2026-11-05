import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SmartImage } from '@/components/site/SmartImage';
import { Reveal } from '@/components/site/Reveal';
import { SocialLinks } from '@/components/site/SocialLinks';

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop';

export function Hero({ about }) {
  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16 lg:pt-24">
      {/* Background: topographic rings + soft glows */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full text-accent opacity-[0.07]" aria-hidden>
        <defs>
          <pattern id="topo" width="64" height="64" patternUnits="userSpaceOnUse">
            <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="0.6" />
            <circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topo)" />
      </svg>
      <div className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-accent/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-[480px] w-[480px] rounded-full bg-sky-500/10 blur-[140px]" />

      <div className="container-page relative grid items-center gap-16 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
        {/* Text */}
        <Reveal className="order-2 lg:order-1">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1.5 text-sm font-medium text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Welcome to my portfolio!
          </p>

          <h1 className="mt-6 text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl">
            Hello, my name&apos;s{' '}
            <span className="bg-gradient-to-r from-accent via-blue-400 to-sky-300 bg-clip-text text-transparent">
              {about.name || 'there'}
            </span>
            <span className="text-accent">.</span>
          </h1>

          <div className="mt-7 max-w-xl space-y-3 text-lg leading-relaxed text-muted">
            {about.role && (
              <p>
                I&apos;m a <span className="font-semibold text-fg">{about.role}</span>.
              </p>
            )}
            {about.shortBio && <p>{about.shortBio}</p>}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="btn-primary group px-7 py-3.5 text-base shadow-[0_0_24px_rgb(59_130_246/0.45)] hover:shadow-[0_0_36px_rgb(59_130_246/0.6)]"
            >
              View Projects
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </a>
            <a href="#contact" className="btn group border border-border px-7 py-3.5 text-base hover:border-fg/40 hover:bg-card">
              Contact me
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </a>
            {about.resumeFile && (
              <a href={about.resumeFile} target="_blank" rel="noopener noreferrer" className="btn px-3 py-3.5 text-base text-muted hover:text-fg">
                Resume <ArrowUpRight size={16} />
              </a>
            )}
          </div>

          {/* Mobile socials */}
          <SocialLinks about={about} className="mt-10 lg:hidden" />

          {/* Scroll indicator */}
          <a href="#about" className="mt-16 hidden items-center gap-3 text-muted transition hover:text-fg lg:inline-flex">
            <span className="flex h-12 w-7 justify-center rounded-full border-2 border-border pt-2">
              <span className="animate-scroll-dot h-2.5 w-1 rounded-full bg-accent" />
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.25em]">Scroll down</span>
          </a>
        </Reveal>

        {/* Portrait */}
        <Reveal delay={0.15} className="relative order-1 flex justify-center lg:order-2">
          <div className="relative">
            {/* Rotating dashed orbit */}
            <div className="animate-spin-slow absolute -inset-6 rounded-[50%] border border-dashed border-accent/30 sm:-inset-8" />

            {/* Oval photo with glow + inner ring */}
            <div className="relative h-[340px] w-[270px] overflow-hidden rounded-[50%] border-4 border-card bg-card shadow-[0_0_80px_rgb(59_130_246/0.25)] sm:h-[460px] sm:w-[370px] xl:h-[520px] xl:w-[420px]">
              <SmartImage
                src={about.profileImage || FALLBACK_PHOTO}
                alt={about.name || 'Portrait'}
                fill
                priority
                sizes="(min-width: 1280px) 420px, (min-width: 640px) 370px, 270px"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-2 rounded-[50%] border-2 border-accent/80" />
              {/* Darkening fade only in dark mode – in light mode it would wash the photo out */}
              <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-bg/40 via-transparent to-transparent dark:block" />
            </div>

            {/* Floating shapes */}
            <div className="animate-float absolute -left-8 top-12 h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-blue-400 opacity-90 shadow-2xl shadow-accent/40 sm:-left-12 sm:h-20 sm:w-20" />
            <div
              className="animate-float absolute -right-4 bottom-12 h-14 w-14 rounded-full border-4 border-sky-300/80 shadow-[0_0_20px_rgb(59_130_246/0.5)] sm:h-16 sm:w-16"
              style={{ animationDelay: '-2.5s' }}
            />
            <div className="animate-float absolute -right-2 top-6 h-3 w-3 rounded-full bg-sky-300" style={{ animationDelay: '-1s' }} />

            {/* University badge */}
            {about.university && (
              <div className="card absolute -bottom-4 left-1/2 w-max max-w-[260px] -translate-x-1/2 px-4 py-2.5 text-center text-xs shadow-xl backdrop-blur sm:text-sm">
                🎓 <span className="font-medium">{about.university}</span>
              </div>
            )}
          </div>

          {/* Vertical "Follow me on" socials */}
          <div className="absolute -right-2 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-5 xl:-right-10 lg:flex">
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted [writing-mode:vertical-rl]">
              Follow me on
            </span>
            <span className="h-12 w-px bg-border" />
            <SocialLinks about={about} className="flex-col" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
