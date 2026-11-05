'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Award, ExternalLink, FolderGit2, Image as ImageIcon, LayoutDashboard, Layers, LogOut, Mail, Menu, UserRound, X } from 'lucide-react';
import { logout } from '@/actions/auth';
import { ThemeToggle } from '@/components/site/ThemeToggle';

const NAV = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/admin/about', label: 'About', Icon: UserRound },
  { href: '/admin/profile', label: 'Images & CV', Icon: ImageIcon },
  { href: '/admin/projects', label: 'Projects', Icon: FolderGit2 },
  { href: '/admin/skills', label: 'Skills', Icon: Layers },
  { href: '/admin/certifications', label: 'Certifications', Icon: Award },
  { href: '/admin/messages', label: 'Messages', Icon: Mail },
];

export function Sidebar({ email, unread }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-bg/80 px-4 py-3 backdrop-blur lg:hidden">
        <span className="font-semibold">Admin</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-9 w-9 place-items-center rounded-full border border-border"><Menu size={16} /></button>
      </div>

      {open && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card p-4 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between px-2 pt-2">
          <div>
            <p className="font-semibold">Portfolio Admin</p>
            <p className="max-w-[170px] truncate text-xs text-muted">{email}</p>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="lg:hidden"><X size={18} /></button>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV.map(({ href, label, Icon }) => {
            const active = href === '/admin' ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active ? 'bg-accent-soft font-medium text-accent' : 'text-muted hover:bg-card-hover hover:text-fg'
                }`}
              >
                <Icon size={17} />
                <span className="flex-1">{label}</span>
                {label === 'Messages' && unread > 0 && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-fg">{unread}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-border pt-4">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-card-hover hover:text-fg">
            <ExternalLink size={17} /> View site
          </Link>
          <div className="flex items-center gap-2">
            <form action={logout} className="flex-1">
              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-red-500/10 hover:text-red-500">
                <LogOut size={17} /> Sign out
              </button>
            </form>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
