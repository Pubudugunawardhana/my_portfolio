import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Section } from './components/Section';
import { MemoryGame } from './components/MemoryGame';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 antialiased selection:bg-primary-500 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        
        <Section id="fun-zone" title="Fun Zone" className="bg-slate-50 dark:bg-slate-900/50">
          <MemoryGame />
        </Section>

        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
