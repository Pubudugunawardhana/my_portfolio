import { connectDB } from '@/lib/db';
import Analytics from '@/lib/models/Analytics';

// Public: count one page view (the client calls this once per browser session).
export async function POST() {
  try {
    await connectDB();
    const date = new Date().toISOString().split('T')[0];
    const stat = await Analytics.findOneAndUpdate(
      { date },
      { $inc: { views: 1 }, $set: { lastUpdated: new Date() } },
      { upsert: true, returnDocument: 'after' }
    );
    return Response.json({ views: stat.views });
  } catch (err) {
    console.error('Analytics increment failed:', err.message);
    return Response.json({ message: 'Failed to record view' }, { status: 500 });
  }
}
