import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Section } from './Section';
import { listenToProjectsFromFirebase } from '../services/projectService';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

export function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  // Bind strictly to the live Firebase Socket Stream
  useEffect(() => {
    const unsub = listenToProjectsFromFirebase((liveData) => {
      setProjects(liveData);
      setIsLoading(false);
    });
    
    // Auto-cleanup memory when unmounting
    return () => unsub();
  }, []);
  return (
    <Section id="projects" title="Featured Projects" className="bg-slate-50 dark:bg-slate-900/50">
      
      {/* Loading State UI */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
           <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
           <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium tracking-wide animate-pulse">Loading Cloud Projects...</p>
        </div>
      ) : (
      
      <div className="relative group/slider">
        {/* Desktop Navigation Buttons */}
        <div className="absolute top-1/2 -left-4 lg:-left-6 transform -translate-y-1/2 z-10 hidden md:block opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => scroll('left')}
            className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        
        <div className="absolute top-1/2 -right-4 lg:-right-6 transform -translate-y-1/2 z-10 hidden md:block opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => scroll('right')}
            className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Scrolling Container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-8 pb-8 pt-4 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden px-2 md:px-4"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id || project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-21.33px)] flex-shrink-0 snap-start group flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 dark:border-slate-700 transition-all duration-300"
            >
              {/* Image Container with Hover zoom effect */}
            <div className="relative h-56 overflow-hidden">
              <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
              />
            </div>
            
            {/* Card Content Area */}
            <div className="flex flex-col flex-grow p-6 sm:p-8 space-y-4">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white group-hover:text-blue-500 transition-colors">
                {project.title}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-300 flex-grow">
                {project.description}
              </p>
              
              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-2 pt-4">
                {Array.isArray(project.tech) && project.tech.map((techItem) => (
                  <span 
                    key={techItem} 
                    className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 rounded-full"
                  >
                    {techItem}
                  </span>
                ))}
              </div>
              
              {/* Card Footer Links */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-700 mt-auto">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium transition-colors"
                >
                  <FaGithub className="w-5 h-5" />
                  <span>Code</span>
                </a>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-medium transition-colors ml-auto"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
        
          {projects.length === 0 && !isLoading && (
            <div className="w-full py-12 text-center text-slate-500">
              No projects found in your database. Open the Admin Panel to create some!
            </div>
          )}
        </div>
      </div>
      
      )} {/* Close Loading ternary wrapper */}
    </Section>
  );
}
