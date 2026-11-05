import { FaGithub, FaLinkedinIn, FaMedium } from 'react-icons/fa';

export function SocialLinks({ about, className = '' }) {
  const links = [
    { href: about.github, label: 'GitHub', Icon: FaGithub },
    { href: about.linkedin, label: 'LinkedIn', Icon: FaLinkedinIn },
    { href: about.medium, label: 'Medium', Icon: FaMedium },
  ].filter((l) => l.href);

  return (
    <div className={`flex gap-2 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-muted transition hover:-translate-y-0.5 hover:text-fg"
        >
          <Icon size={16} />
        </a>
      ))}
    </div>
  );
}
