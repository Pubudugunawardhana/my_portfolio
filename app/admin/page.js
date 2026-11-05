import Link from 'next/link';
import { Award, Eye, FolderGit2, Layers, Mail } from 'lucide-react';
import { auth } from '@/auth';
import { getCertifications, getDailyViews, getMessages, getProjects, getSkills, safe } from '@/lib/data';
import { AnalyticsChart } from '@/components/admin/AnalyticsChart';
import { PageHeader } from '@/components/admin/ui';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const [session, views, projects, skills, certifications, messages] = await Promise.all([
    auth(),
    safe(getDailyViews, {}),
    safe(getProjects, []),
    safe(getSkills, []),
    safe(getCertifications, []),
    safe(getMessages, []),
  ]);

  const today = new Date().toISOString().split('T')[0];
  const totalViews = Object.values(views).reduce((s, v) => s + v, 0);
  const unread = messages.filter((m) => !m.read);

  const stats = [
    { label: 'Total views', value: totalViews, hint: `${views[today] || 0} today`, Icon: Eye, href: null },
    { label: 'Projects', value: projects.length, Icon: FolderGit2, href: '/admin/projects' },
    { label: 'Skills', value: skills.reduce((s, g) => s + g.tech.length, 0), hint: `${skills.length} categories`, Icon: Layers, href: '/admin/skills' },
    { label: 'Certifications', value: certifications.length, Icon: Award, href: '/admin/certifications' },
    { label: 'Messages', value: messages.length, hint: `${unread.length} unread`, Icon: Mail, href: '/admin/messages' },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description={`Welcome back${session?.user?.email ? `, ${session.user.email}` : ''}.`} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(({ label, value, hint, Icon, href }) => {
          const body = (
            <>
              <div className="flex items-center justify-between text-muted">
                <span className="text-sm">{label}</span>
                <Icon size={16} />
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{value.toLocaleString()}</p>
              {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
            </>
          );
          return href ? (
            <Link key={label} href={href} className="card p-5 transition hover:border-accent/40">{body}</Link>
          ) : (
            <div key={label} className="card p-5">{body}</div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <AnalyticsChart dailyViews={views} />

        <div className="card flex flex-col p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Latest messages</h2>
            <Link href="/admin/messages" className="text-sm text-accent hover:underline">View all</Link>
          </div>
          {messages.length === 0 ? (
            <p className="text-sm text-muted">No messages yet.</p>
          ) : (
            <ul className="space-y-3">
              {messages.slice(0, 5).map((m) => (
                <li key={m._id} className="flex items-start gap-3">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.read ? 'bg-border' : 'bg-accent'}`} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{m.name}</p>
                    <p className="truncate text-xs text-muted">{m.subject || m.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
