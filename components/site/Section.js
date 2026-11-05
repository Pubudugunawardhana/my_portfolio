import { Reveal } from './Reveal';

export function Section({ id, eyebrow, title, description, children, className = '' }) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${className}`}>
      <div className="container-page">
        <Reveal className="mb-14 max-w-2xl">
          {eyebrow && (
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
          )}
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h2>
          <span className="mt-4 block h-1.5 w-20 rounded-full bg-gradient-to-r from-accent to-sky-400" />
          {description && <p className="mt-5 text-base text-muted sm:text-lg">{description}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
