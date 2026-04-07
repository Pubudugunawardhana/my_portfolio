import React from 'react';
import { motion } from 'framer-motion';
import { Section } from './Section';
import { personalInfo } from '../data/portfolio';

export function About() {
  return (
    <Section id="about" title="About Me" className="bg-gray-50 dark:bg-gray-800/50">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative aspect-square md:aspect-[4/5] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1000&auto=format&fit=crop"
                alt={personalInfo.name}
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Driven by passion & purpose.
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {personalInfo.longBio}
          </p>
          
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Location</h4>
              <p className="text-gray-600 dark:text-gray-300">San Francisco, CA</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Availability</h4>
              <p className="text-green-600 dark:text-green-400">Open to opportunities</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
