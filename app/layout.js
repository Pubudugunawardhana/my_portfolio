import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import { getAbout, safe } from '@/lib/data';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata() {
  const about = await safe(getAbout, {});
  const name = about.name || 'Portfolio';
  const description = about.shortBio || `${name} — ${about.role || 'Developer'} portfolio`;
  const image = about.profileImage?.startsWith('http') ? about.profileImage : undefined;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${name} | Portfolio`, template: `%s | ${name}` },
    description,
    icons: image ? { icon: image, apple: image } : undefined,
    openGraph: { type: 'website', url: siteUrl, title: `${name} | Portfolio`, description, images: image ? [image] : undefined },
    twitter: { card: 'summary_large_image', title: `${name} | Portfolio`, description, images: image ? [image] : undefined },
  };
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
