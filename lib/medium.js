import 'server-only';
import { XMLParser } from 'fast-xml-parser';

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

function snippet(html = '') {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/Continue reading on Medium.*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > 300 ? `${text.slice(0, 300)}…` : text;
}

// Fetch the Medium RSS feed server-side (no third-party proxy), cached for an hour.
export async function getMediumPosts() {
  const username = process.env.MEDIUM_USERNAME || '@pubudugunawardhana23';
  try {
    const res = await fetch(`https://medium.com/feed/${username}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Medium responded ${res.status}`);

    const xml = await res.text();
    const feed = new XMLParser({ ignoreAttributes: false }).parse(xml);

    return toArray(feed?.rss?.channel?.item).map((item) => {
      const content = item['content:encoded'] || item.description || '';
      const image = content.match(/<img[^>]+src="([^">]+)"/)?.[1] ?? null;
      return {
        title: item.title,
        link: String(item.link).split('?')[0],
        pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : null,
        thumbnail: image,
        description: snippet(content),
        categories: toArray(item.category).map(String),
      };
    });
  } catch (err) {
    console.error('Failed to load Medium posts:', err.message);
    return [];
  }
}
