import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Section } from './Section';
import { getAboutFromFirebase } from '../services/aboutService';
import { MapPin, Calendar, Mail, FileText, GraduationCap, BookOpen } from 'lucide-react';

export function About() {
  const [personalInfo, setPersonalInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Hook runs immediately on component mount
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const firestoreData = await getAboutFromFirebase();
        if (firestoreData) {
          setPersonalInfo(firestoreData);
        }
      } catch (error) {
        console.error("Failed to load about data from cloud: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAboutData();
  }, []);
  return (
    <Section id="about" title="About Me" className="bg-gray-50 dark:bg-gray-800/50">
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
           <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
           <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium tracking-wide animate-pulse">Loading Bio...</p>
        </div>
      ) : (

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
              <p className="text-gray-600 dark:text-gray-300">{personalInfo.location || 'Not Specified'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Availability</h4>
              <p className="text-green-600 dark:text-green-400">Open to opportunities</p>
            </div>
          </div>

          {/* Education Section */}
          {(personalInfo.university || personalInfo.school) && (
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
             <h4 className="font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary-500" />
                Educational Background
             </h4>
             <div className="space-y-5">
               {personalInfo.university && (
                 <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 border border-primary-200 dark:border-primary-800">
                       <GraduationCap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="pt-1">
                      <h5 className="font-bold text-gray-900 dark:text-white text-lg">University</h5>
                      <p className="text-gray-600 dark:text-gray-300">{personalInfo.university}</p>
                    </div>
                 </div>
               )}
               {personalInfo.school && (
                 <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
                       <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="pt-1">
                      <h5 className="font-bold text-gray-900 dark:text-white text-lg">High School</h5>
                      <p className="text-gray-600 dark:text-gray-300">{personalInfo.school}</p>
                    </div>
                 </div>
               )}
             </div>
          </div>
          )}
        </motion.div>
      </div>
      
      )}
    </Section>
  );
}
