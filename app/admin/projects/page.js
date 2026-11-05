import { getProjects, safe } from '@/lib/data';
import { ProjectsManager } from '@/components/admin/managers';
import { PageHeader } from '@/components/admin/ui';

export const metadata = { title: 'Projects' };

export default async function AdminProjectsPage() {
  const items = await safe(getProjects, []);
  return (
    <>
      <PageHeader title="Projects" description="Add, edit and remove the projects shown on your portfolio." />
      <ProjectsManager items={items} />
    </>
  );
}
