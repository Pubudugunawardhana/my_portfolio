import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Section } from './Section';
import { useCertifications } from '../hooks/useCertifications';
import { ExternalLink, Award, ChevronLeft, ChevronRight } from 'lucide-react';

export function Certifications() {
  const { certifications, isLoading } = useCertifications();
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

  return (
    <Section id="certifications" title="Certifications" className="bg-white dark:bg-slate-900">
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
           <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
           <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium tracking-wide animate-pulse">Loading Credentials...</p>
        </div>
      ) : certifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Award className="w-16 h-16 text-slate-200 dark:text-slate-800 mb-4" />
          <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400">No Certifications Yet</h3>
          <p className="text-slate-400 dark:text-slate-500 mt-2">Check back later for updated credentials.</p>
        </div>
      ) : (
        <div className="relative group/slider">
          {/* Desktop Navigation Buttons */}
          <div className="absolute top-1/2 -left-4 lg:-left-6 transform -translate-y-1/2 z-10 hidden md:block opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
            <button 
              onClick={() => scroll('left')}
              className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:scale-110 active:scale-95 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          
          <div className="absolute top-1/2 -right-4 lg:-right-6 transform -translate-y-1/2 z-10 hidden md:block opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
            <button 
              onClick={() => scroll('right')}
              className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:scale-110 active:scale-95 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Scrolling Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-8 pb-8 pt-4 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden px-2 md:px-4"
          >
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id || cert.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-21.33px)] flex-shrink-0 snap-start group flex flex-col bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-100 dark:border-slate-700 transition-all duration-300"
              >
              {/* Image Container */}
              <div className="relative h-48 bg-white dark:bg-slate-900 flex items-center justify-center p-6 overflow-hidden border-b border-slate-100 dark:border-slate-700">
                <div className="absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                {cert.image ? (
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
                  />
                ) : (
                  <Award className="w-20 h-20 text-slate-300 dark:text-slate-700 transform group-hover:scale-110 group-hover:text-purple-400 transition-all duration-500 ease-in-out" />
                )}
              </div>
              
              {/* Card Content Area */}
              <div className="flex flex-col flex-grow p-6 sm:p-8 space-y-3">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-purple-500 transition-colors">
                  {cert.title}
                </h3>
                
                <div className="flex-grow">
                  <p className="text-md font-semibold text-slate-600 dark:text-slate-300">
                    {cert.issuer}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Issued: {cert.date}
                  </p>
                </div>
                
                {/* Card Footer Links */}
                {cert.credentialUrl && (
                  <div className="pt-6 mt-auto border-t border-slate-200 dark:border-slate-700">
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
