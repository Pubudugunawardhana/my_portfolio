import React from 'react';
import { motion } from 'framer-motion';

export function Section({ children, id, className = '', title }) {
  return (
    <section id={id} className={`py-20 md:py-32 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              {title}
            </h2>
            <div className="h-1.5 w-20 bg-primary-600 rounded-full"></div>
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
