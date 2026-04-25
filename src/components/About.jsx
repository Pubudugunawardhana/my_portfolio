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
            {/* Glowing background effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col items-center">
            {/* Cover Banner */}
            <div className="w-full h-32 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
               {personalInfo.coverImage ? (
                 <img src={personalInfo.coverImage} alt="Cover" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-400 dark:from-blue-600 dark:via-indigo-700 dark:to-purple-800"></div>
               )}
            </div>
            
            <div className="px-6 pb-8 flex flex-col items-center w-full relative">
              {/* Profile Avatar overlapping the banner, centered */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-slate-200 shadow-lg">
                <img
                  src={personalInfo.profileImage || "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1000&auto=format&fit=crop"}
                  alt={personalInfo.name || "Profile"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Push content down to make room for avatar */}
              <div className="mt-24 flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {personalInfo.name || "Loading..."}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  {personalInfo.role || "Professional"}
                </p>
                
                <div className="flex items-center justify-center gap-2 mt-2 mb-6 text-slate-600 dark:text-slate-400">
                  <MapPin size={16} className="text-blue-500" />
                  <span className="text-sm font-medium">{personalInfo.location || "Not Specified"}</span>
                </div>
              </div>

              {/* Full Width Connect Button */}
              <a 
                href={personalInfo.linkedin || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                Connect
              </a>

              {/* Education Section inside Profile Card */}
              {(personalInfo.university || personalInfo.school) && (
              <div className="w-full mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-left">
                 <h4 className="font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-500" />
                    Educational Background
                 </h4>
                 <div className="space-y-5">
                   {personalInfo.university && (
                     <div className="flex gap-3 items-start">
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800">
                           <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="pt-0.5">
                          <h5 className="font-bold text-slate-900 dark:text-white text-sm">University</h5>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-snug">{personalInfo.university}</p>
                        </div>
                     </div>
                   )}
                   {personalInfo.school && (
                     <div className="flex gap-3 items-start">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-800">
                           <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="pt-0.5">
                          <h5 className="font-bold text-slate-900 dark:text-white text-sm">High School</h5>
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-snug">{personalInfo.school}</p>
                        </div>
                     </div>
                   )}
                 </div>
              </div>
              )}
            </div>
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
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {personalInfo.longBio}
          </p>
          
          <div className="grid grid-cols-1 pt-6 border-t border-slate-200 dark:border-slate-700 gap-8">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Availability</h4>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2">
                 <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                 Open to opportunities
              </p>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Resume</h4>
              {personalInfo.resumeFile ? (
                <a 
                  href={personalInfo.resumeFile} 
                  download="Pubudu_Gunawardhana_CV.pdf"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <FileText size={20} />
                  <span>Download CV</span>
                </a>
              ) : (
                <button 
                  disabled
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold rounded-xl cursor-not-allowed"
                >
                  <FileText size={20} />
                  <span>CV Not Available</span>
                </button>
              )}
            </div>
          </div>

        </motion.div>
      </div>
      
      )}
    </Section>
  );
}
