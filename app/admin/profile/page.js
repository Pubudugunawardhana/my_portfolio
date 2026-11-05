import { getAbout, safe } from '@/lib/data';
import { ProfileForm } from '@/components/admin/ProfileForm';
import { PageHeader } from '@/components/admin/ui';

export const metadata = { title: 'Images & CV' };

export default async function AdminProfilePage() {
  const about = await safe(getAbout, {});
  return (
    <>
      <PageHeader title="Images & CV" description="Profile photo, cover banner and downloadable resume. Files are stored on Cloudinary." />
      <ProfileForm about={about} />
    </>
  );
}
