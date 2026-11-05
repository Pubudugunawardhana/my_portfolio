import { getAbout, safe } from '@/lib/data';
import { AboutForm } from '@/components/admin/AboutForm';
import { PageHeader } from '@/components/admin/ui';

export const metadata = { title: 'About' };

export default async function AdminAboutPage() {
  const about = await safe(getAbout, {});
  return (
    <>
      <PageHeader title="About" description="Your name, bio, education and social links." />
      <AboutForm about={about} />
    </>
  );
}
