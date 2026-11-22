import 'server-only';
import { XMLParser } from 'fast-xml-parser';

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s) =>
  s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, code) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : m;
    }
    return ENTITIES[code.toLowerCase()] ?? m;
  });

// Article HTML → plain text, keeping paragraph breaks. Output is plain text only,
// so nothing from the feed is ever rendered as HTML on the site.
function toText(html = '') {
  return decode(
    html
      .replace(/<figure[\s\S]*?<\/figure>/gi, '') // images and their captions
      .replace(/<(br|\/p|\/h\d|\/li|\/blockquote)\s*\/?>/gi, '\n\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/Continue reading on Medium.*/i, '')
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Cut at a word boundary and add an ellipsis.
function clip(text, max) {
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(' ', max) > max * 0.8 ? text.lastIndexOf(' ', max) : max).trim()}…`;
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
      const text = toText(content);
      const words = text.split(/\s+/).filter(Boolean).length;
      return {
        title: decode(String(item.title ?? '')),
        link: String(item.link).split('?')[0],
        pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : null,
        thumbnail: image,
        description: clip(text.replace(/\n+/g, ' '), 300), // card preview
        excerpt: clip(text, 1400), // longer preview for the article modal
        readingMinutes: Math.max(1, Math.round(words / 220)),
        categories: toArray(item.category).map(String),
      };
    });
  } catch (err) {
    console.error('Failed to load Medium posts:', err.message);
    return [];
  }
}
