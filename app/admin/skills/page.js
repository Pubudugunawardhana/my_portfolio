import { getSkills, safe } from '@/lib/data';
import { SkillsManager } from '@/components/admin/managers';
import { PageHeader } from '@/components/admin/ui';

export const metadata = { title: 'Skills' };

export default async function AdminSkillsPage() {
  const items = await safe(getSkills, []);
  return (
    <>
      <PageHeader title="Skills" description="Skill categories and the technologies in each." />
      <SkillsManager items={items} />
    </>
  );
}
