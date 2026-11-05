'use client';

import { useActionState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUp, CheckCircle2, Lock, Mail, MapPin, Send } from 'lucide-react';
import { sendMessage } from '@/actions/contact';
import { Reveal } from '@/components/site/Reveal';
import { SocialLinks } from '@/components/site/SocialLinks';

const QUICK_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#certifications', label: 'Certifications' },
  { href: '#blogs', label: 'Blog' },
];

// Contact form and site footer combined into one closing panel.
export function Contact({ about }) {
  const [state, formAction, pending] = useActionState(sendMessage, null);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <footer id="contact" className="relative mt-12 overflow-hidden border-t border-border bg-footer sm:mt-20">
      {/* Soft accent line + glow along the top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />

      <div className="container-page relative pt-20 pb-10 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/* Pitch + contact details */}
          <Reveal className="flex flex-col">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Contact</p>
            <h2 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Let&apos;s build something <span className="text-accent">together</span>.
            </h2>
            <span className="mt-4 block h-1.5 w-20 rounded-full bg-gradient-to-r from-accent to-sky-400" />
            <p className="mt-6 max-w-md text-lg text-muted">
              Have a project, an opportunity, or just want to say hi? My inbox is always open — I&apos;ll get back to you as soon as I can.
            </p>

            <div className="mt-8 space-y-4">
              {about.email && (
                <a href={`mailto:${about.email}`} className="group flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-fg shadow-lg shadow-accent/30 transition group-hover:-translate-y-0.5">
                    <Mail size={20} />
                  </span>
                  <span>
                    <span className="block text-xs text-muted">Email me at</span>
                    <span className="break-all font-medium underline-offset-4 group-hover:underline">{about.email}</span>
                  </span>
                </a>
              )}
              {about.location && (
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-border bg-card text-accent">
                    <MapPin size={20} />
                  </span>
                  <span>
                    <span className="block text-xs text-muted">Based in</span>
                    <span className="font-medium">{about.location}</span>
                  </span>
                </div>
              )}
            </div>

            <SocialLinks about={about} className="mt-10 lg:mt-auto lg:pt-10" />
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <form ref={formRef} action={formAction} className="card space-y-4 p-6 shadow-xl shadow-black/5 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Name</span>
                  <input name="name" required maxLength={100} autoComplete="name" placeholder="Jane Doe" className="input" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Email</span>
                  <input name="email" type="email" required autoComplete="email" placeholder="jane@example.com" className="input" />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Subject <span className="text-muted">(optional)</span></span>
                <input name="subject" maxLength={150} placeholder="Project inquiry" className="input" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Message</span>
                <textarea name="message" required minLength={5} rows={5} placeholder="Tell me a bit about it…" className="input resize-none" />
              </label>
              {/* Honeypot field – hidden from people, filled in by bots */}
              <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

              {state && (
                <p
                  role="status"
                  className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                    state.ok ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                  }`}
                >
                  {state.ok ? <><CheckCircle2 size={16} /> Thanks! Your message has been sent.</> : state.error}
                </p>
              )}

              <button type="submit" disabled={pending} className="btn-primary w-full py-3 shadow-lg shadow-accent/25">
                {pending ? 'Sending…' : <>Send message <Send size={15} /></>}
              </button>
            </form>
          </Reveal>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col-reverse items-center justify-between gap-6 border-t border-border pt-8 sm:mt-20 md:flex-row">
          <p className="flex items-center gap-2 text-sm text-muted">
            © {new Date().getFullYear()} {about.name || 'Portfolio'}. All rights reserved.
            {/* Discreet admin entry point */}
            <Link
              href="/login"
              rel="nofollow"
              aria-label="Admin login"
              title="Admin"
              className="grid h-6 w-6 place-items-center rounded-full opacity-30 transition hover:bg-card hover:text-accent hover:opacity-100 focus-visible:opacity-100"
            >
              <Lock size={12} />
            </Link>
          </p>
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted">
            {QUICK_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="transition hover:text-fg">{l.label}</a>
            ))}
          </nav>
          <a
            href="#home"
            aria-label="Back to top"
            className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-fg shadow-lg shadow-accent/30 transition hover:-translate-y-0.5"
          >
            <ArrowUp size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
