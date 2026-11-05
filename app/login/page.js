import { redirect } from 'next/navigation';
import { auth, isAdminEmail } from '@/auth';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata = { title: 'Admin login', robots: { index: false } };

const ERRORS = {
  AccessDenied: 'That Google account is not authorized for the admin panel.',
  Configuration: 'Sign-in is not configured correctly. Check the server environment variables.',
};

export default async function LoginPage({ searchParams }) {
  const session = await auth();
  if (isAdminEmail(session?.user?.email)) redirect('/admin');

  const { error } = await searchParams;
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <LoginForm initialError={error ? ERRORS[error] ?? 'Sign-in failed. Please try again.' : null} />
    </main>
  );
}
