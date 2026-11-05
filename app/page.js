import { connection } from 'next/server';
import { getAbout, getProjects, getSkills, getCertifications, safe } from '@/lib/data';
import { getMediumPosts } from '@/lib/medium';
import { Navbar } from '@/components/site/Navbar';
import { PageViewTracker } from '@/components/site/PageViewTracker';
import { SiteBackground } from '@/components/site/SiteBackground';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { Certifications } from '@/components/sections/Certifications';
import { Blogs } from '@/components/sections/Blogs';
import { Contact } from '@/components/sections/Contact';

export default async function HomePage() {
  // Render per request (data itself is cached), so a DB hiccup at build
  // time never gets baked into a static page.
  await connection();

  const [about, projects, skills, certifications, posts] = await Promise.all([
    safe(getAbout, {}),
    safe(getProjects, []),
    safe(getSkills, []),
    safe(getCertifications, []),
    getMediumPosts(),
  ]);

  return (
    <>
      <PageViewTracker />
      <SiteBackground />
      <Navbar />
      <main>
        <Hero about={about} />
        <About about={about} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Certifications certifications={certifications} />
        <Blogs posts={posts} mediumUrl={about.medium} />
      </main>
      <Contact about={about} />
    </>
  );
}
