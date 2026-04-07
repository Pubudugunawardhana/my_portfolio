import React from 'react';
import { motion } from 'framer-motion';
import { Section } from './Section';
import { skills } from '../data/portfolio';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export function Skills() {
  return (
    <Section id="skills" title="My Skills">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {skills.map((skillSet, index) => {
          const Icon = skillSet.icon;
          return (
            <motion.div
              key={skillSet.name}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group"
            >
              <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/40 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {skillSet.name}
              </h3>
              <ul className="space-y-3">
                {skillSet.tech.map((tech) => (
                  <li key={tech} className="flex items-center text-gray-600 dark:text-gray-300">
                    <span className="w-2 h-2 bg-primary-400 dark:bg-primary-500 rounded-full mr-3"></span>
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
