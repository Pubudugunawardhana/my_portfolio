import React from 'react';
import { personalInfo } from '../data/portfolio';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">
          © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Built with React & Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
