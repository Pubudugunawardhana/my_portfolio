import React from 'react';
import { motion } from 'framer-motion';
import { Section } from './Section';
import { projects } from '../data/portfolio';
import { ExternalLink } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

export function Projects() {
  return (
    <Section id="projects" title="Featured Projects" className="bg-gray-50 dark:bg-gray-800/50">
      <div className="grid grid-cols-1 gap-16">
        {projects.map((project, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
            >
              {/* Image side */}
              <div className="w-full lg:w-1/2 group">
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <div className="absolute inset-0 bg-primary-600/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-[300px] md:h-[400px] object-cover filter brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700"
                  />
                </div>
              </div>
              
              {/* Content side */}
              <div className="w-full lg:w-1/2 space-y-6">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {project.title}
                </h3>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg relative z-20">
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    {project.description}
                  </p>
                </div>
                
                <ul className="flex flex-wrap gap-3 font-mono text-sm text-primary-600 dark:text-primary-400">
                  {project.tech.map((t) => (
                    <li key={t} className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 rounded-full">
                      {t}
                    </li>
                  ))}
                </ul>
                
                <div className="flex gap-6 pt-4">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    <FaGithub className="w-6 h-6" />
                    <span className="font-medium">Code</span>
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-6 h-6" />
                    <span className="font-medium">Live Demo</span>
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
