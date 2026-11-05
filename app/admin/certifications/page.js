import { getCertifications, safe } from '@/lib/data';
import { CertificationsManager } from '@/components/admin/managers';
import { PageHeader } from '@/components/admin/ui';

export const metadata = { title: 'Certifications' };

export default async function AdminCertificationsPage() {
  const items = await safe(getCertifications, []);
  return (
    <>
      <PageHeader title="Certifications" description="Courses and credentials you have earned." />
      <CertificationsManager items={items} />
    </>
  );
}
