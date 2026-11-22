import { getCertificationCategories, getCertifications, safe } from '@/lib/data';
import { CategoriesManager, CertificationsManager } from '@/components/admin/managers';
import { PageHeader } from '@/components/admin/ui';

export const metadata = { title: 'Certifications' };

export default async function AdminCertificationsPage() {
  const [items, categories] = await Promise.all([safe(getCertifications, []), safe(getCertificationCategories, [])]);
  return (
    <>
      <PageHeader title="Certifications" description="Courses and credentials you have earned." />

      <section className="mb-12">
        <h2 className="mb-1 font-semibold">Certification categories</h2>
        <p className="mb-4 text-sm text-muted">
          Shown as tabs above your certifications (when more than one has certifications). Drag to change the tab order.
        </p>
        <CategoriesManager kind="certificationCategory" items={categories} entries={items} noun="certification" placeholder="e.g. Cloud, Security" />
      </section>

      <section>
        <h2 className="mb-4 font-semibold">All certifications</h2>
        <CertificationsManager items={items} categories={categories} />
      </section>
    </>
  );
}
