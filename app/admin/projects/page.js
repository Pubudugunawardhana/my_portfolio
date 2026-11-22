import { getProjectCategories, getProjects, safe } from '@/lib/data';
import { CategoriesManager, ProjectsManager } from '@/components/admin/managers';
import { PageHeader } from '@/components/admin/ui';

export const metadata = { title: 'Projects' };

export default async function AdminProjectsPage() {
  const [items, categories] = await Promise.all([safe(getProjects, []), safe(getProjectCategories, [])]);
  return (
    <>
      <PageHeader title="Projects" description="Add, edit and remove the projects shown on your portfolio." />

      <section className="mb-12">
        <h2 className="mb-1 font-semibold">Project categories</h2>
        <p className="mb-4 text-sm text-muted">
          Shown as tabs above your projects (when more than one has projects). Drag to change the tab order.
        </p>
        <CategoriesManager kind="projectCategory" items={categories} entries={items} noun="project" placeholder="e.g. Mobile Apps" />
      </section>

      <section>
        <h2 className="mb-4 font-semibold">All projects</h2>
        <ProjectsManager items={items} categories={categories} />
      </section>
    </>
  );
}
