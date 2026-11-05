import { redirect } from 'next/navigation';
import { auth, isAdminEmail } from '@/auth';
import { getMessages, safe } from '@/lib/data';
import { Sidebar } from '@/components/admin/Sidebar';

export const metadata = { title: 'Admin', robots: { index: false } };

export default async function AdminLayout({ children }) {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) redirect('/login');

  const messages = await safe(getMessages, []);
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar email={session.user.email} unread={unread} />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
