import { requireAdmin } from '@/auth';
import { signUpload } from '@/lib/cloudinary';

// Admin-only: returns a short-lived signature for a direct Cloudinary upload.
export async function POST() {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return Response.json({ message: 'Cloudinary is not configured' }, { status: 500 });
  }
  return Response.json(signUpload());
}
