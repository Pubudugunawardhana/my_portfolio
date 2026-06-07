import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from './Section';
import { listenToProjectsFromFirebase } from '../services/projectService';
import { ExternalLink, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

export function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
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
            <div className="flex flex-col flex-grow p-6 sm:p-8">
              {/* Title Area - Flex Grow to push everything else down evenly */}
              <div className="flex-grow mb-4">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white group-hover:text-blue-500 transition-colors">
                  {project.title}
                </h3>
              </div>
              
              {/* Bottom Fixed-Height Area */}
              <div className="flex flex-col space-y-4 shrink-0">
                <button 
                  onClick={() => setSelectedProject(project)}
                  className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:text-blue-700 dark:hover:text-blue-300 transition-colors self-start"
                >
                  Read More
                </button>
                
                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-2 min-h-[3.5rem] content-start">
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
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
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

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            ></div>

            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
              >
                <X size={20} />
              </button>

              {/* Modal Image */}
              <div className="w-full h-64 sm:h-80 relative bg-slate-100 dark:bg-slate-800 shrink-0">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Modal Details */}
              <div className="w-full flex flex-col p-6 sm:p-10 overflow-y-auto">
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">
                  {selectedProject.title}
                </h3>
                
                <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedProject.description}
                  </p>
                </div>
                
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(selectedProject.tech) && selectedProject.tech.map((techItem) => (
                      <span 
                        key={techItem} 
                        className="text-sm font-medium px-4 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 rounded-full border border-blue-100 dark:border-blue-800/30"
                      >
                        {techItem}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl transition-colors"
                    >
                      <FaGithub className="w-5 h-5" />
                      <span>View Code</span>
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </Section>
  );
}
