import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { incrementPageViews } from './services/analyticsService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Section } from './components/Section';
import { MemoryGame } from './components/MemoryGame';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Login } from './components/admin/Login';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

function PortfolioLayout() {
  useEffect(() => {
    // Session token ensures a page reload doesn't artificially spike views
    if (!sessionStorage.getItem('hasVisitedThisSession')) {
       incrementPageViews();
       sessionStorage.setItem('hasVisitedThisSession', 'true');
    }
  }, []);

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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioLayout />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
