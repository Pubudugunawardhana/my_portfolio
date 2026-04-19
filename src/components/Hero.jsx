import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { listenToAboutFromFirebase } from '../services/aboutService';
import { ArrowRight, MousePointer2 } from 'lucide-react';
import { FaGithub, FaMedium, FaLinkedinIn } from 'react-icons/fa';

export function Hero() {
  const [personalInfo, setPersonalInfo] = useState({ name: '', role: '', shortBio: '' });
  const [isLoading, setIsLoading] = useState(true);
  
  // Connect Hero directly to Firebase cloud payload
  useEffect(() => {
    const unsub = listenToAboutFromFirebase((firestoreData) => {
      if (firestoreData) {
        setPersonalInfo(firestoreData);
      }
      setIsLoading(false);
    });
    
    // Automatically detach the live memory listener when navigating away
    return () => unsub();
  }, []);
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-slate-900 dark:bg-slate-950 pt-20">
      {/* Topographic Background Pattern - simulated with subtle SVGs or gradients */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="topo" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0 A 30 30 0 0 0 30 60 A 30 30 0 0 0 30 0" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-500" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 lg:pr-10"
          >
            <div>
              <p className="text-blue-500 font-medium mb-4 text-lg">Welcome to my portfolio!</p>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-2">
                Hello, my <br className="hidden lg:block"/> name's{' '}
                {isLoading ? (
                  <span className="inline-block w-64 h-14 bg-slate-800 animate-pulse rounded-lg align-middle"></span>
                ) : (
                  <span className="text-blue-500">{personalInfo.name}</span>
                )}.
              </h1>
            </div>
            
            <div className="text-xl text-slate-300 max-w-lg min-h-[80px]">
              {isLoading ? (
                <div className="space-y-3 pt-2">
                  <div className="w-48 h-6 bg-slate-800 animate-pulse rounded"></div>
                  <div className="w-full h-4 bg-slate-800 animate-pulse rounded"></div>
                </div>
              ) : (
                <p>
                  I'm a <span className="text-white font-semibold">{personalInfo.role}</span>.
                  <br />
                  {personalInfo.shortBio}
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <a
                href="#projects"
                className="group flex items-center gap-3 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]"
              >
                View Projects
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a
                href="#contact"
                className="flex items-center gap-3 px-8 py-4 bg-transparent border border-slate-500 hover:border-white text-white rounded-full font-medium transition-all"
              >
                Contact me <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            {/* Scroll Indicator */}
            <div className="flex items-center gap-3 pt-16 text-slate-400">
              <div className="w-10 h-16 rounded-full border-2 border-slate-600 flex items-start justify-center p-2">
                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-1.5 h-3 bg-blue-500 rounded-full"
                />
              </div>
              <span className="text-sm tracking-widest uppercase">Scroll down</span>
            </div>
          </motion.div>

          {/* Right Column: Imagery & Visuals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:block flex justify-center"
          >
            {/* Main Image Container */}
            <div className="relative w-72 h-96 lg:w-[450px] lg:h-[550px] mx-auto rounded-full border-4 border-slate-800 shadow-[0_0_60px_rgba(59,130,246,0.2)] overflow-hidden">
              {/* Inner glowing ring */}
              <div className="absolute inset-0 border-2 border-blue-500 rounded-full z-20 m-2 pointer-events-none"></div>
              
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
                alt="Portrait"
                className="w-full h-full object-cover z-10 relative"
              />
            </div>

            {/* Floating Elements (Simulating 3D objects) */}
            <motion.div
              animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-10 left-0 lg:left-10 w-20 h-20 bg-blue-400 rounded-lg shadow-2xl filter blur-[2px] opacity-80"
              style={{ transform: "perspective(400px) rotateY(20deg) rotateX(10deg)" }}
            />
            <motion.div
              animate={{ y: [10, -10, 10], rotate: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute bottom-10 right-10 lg:right-20 w-16 h-16 border-4 border-blue-300 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] opacity-80"
            />

            {/* Socials Column */}
            <div className="hidden lg:flex absolute top-1/2 -right-16 -translate-y-1/2 flex-col items-center gap-6">
              <span className="text-slate-400 text-xs tracking-[0.2em] font-medium rotate-90 whitespace-nowrap mb-12">
                FOLLOW ME ON
              </span>
              <div className="w-[1px] h-12 bg-slate-700 mb-2"></div>
              
              {personalInfo.github && (
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors shadow-lg">
                  <FaGithub size={18} />
                </a>
              )}
              {personalInfo.medium && (
                <a href={personalInfo.medium} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center text-white hover:bg-stone-800 transition-colors shadow-lg">
                  <FaMedium size={18} />
                </a>
              )}
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-colors shadow-lg">
                  <FaLinkedinIn size={18} />
                </a>
              )}
            </div>
            
            {/* Simple Mobile Socials */}
            <div className="flex lg:hidden justify-center gap-6 mt-8">
              {personalInfo.github && (
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white shadow-lg"><FaGithub size={20} /></a>
              )}
              {personalInfo.medium && (
                <a href={personalInfo.medium} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center text-white shadow-lg"><FaMedium size={20} /></a>
              )}
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg"><FaLinkedinIn size={20} /></a>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
