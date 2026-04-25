import React from 'react';
import { motion } from 'framer-motion';
import { Section } from './Section';
import { useSkills } from '../hooks/useSkills';
import { FaReact, FaJs, FaHtml5, FaCss3Alt, FaNodeJs, FaPython, FaJava } from 'react-icons/fa';
import { SiExpress, SiDjango, SiPostgresql, SiMongodb, SiRedis, SiFigma, SiFramer, SiTailwindcss, SiMysql, SiFirebase, SiC, SiPhp } from 'react-icons/si';
import { TbApi } from 'react-icons/tb';

const getTechIcon = (tech) => {
  const icons = {
    'React': <FaReact className="w-4 h-4 text-cyan-400 mr-3" />,
    'JavaScript': <FaJs className="w-4 h-4 text-yellow-400 mr-3" />,
    'HTML': <FaHtml5 className="w-4 h-4 text-orange-500 mr-3" />,
    'CSS': <FaCss3Alt className="w-4 h-4 text-blue-500 mr-3" />,
    'Node.js': <FaNodeJs className="w-4 h-4 text-green-600 mr-3" />,
    'Express': <SiExpress className="w-4 h-4 text-gray-400 mr-3" />,
    'Python': <FaPython className="w-4 h-4 text-blue-500 mr-3" />,
    'Django': <SiDjango className="w-4 h-4 text-green-700 mr-3" />,
    'PostgreSQL': <SiPostgresql className="w-4 h-4 text-blue-400 mr-3" />,
    'MongoDB': <SiMongodb className="w-4 h-4 text-green-500 mr-3" />,
    'Redis': <SiRedis className="w-4 h-4 text-red-500 mr-3" />,
    'Figma': <SiFigma className="w-4 h-4 text-pink-500 mr-3" />,
    'Framer': <SiFramer className="w-4 h-4 text-blue-500 mr-3" />,
    'Tailwind CSS': <SiTailwindcss className="w-4 h-4 text-cyan-500 mr-3" />,
    'MySQL': <SiMysql className="w-4 h-4 text-blue-600 mr-3" />,
    'Firebase': <SiFirebase className="w-4 h-4 text-yellow-500 mr-3" />,
    'C': <SiC className="w-4 h-4 text-blue-600 mr-3" />,
    'Java': <FaJava className="w-4 h-4 text-red-500 mr-3" />,
    'PHP': <SiPhp className="w-4 h-4 text-indigo-500 mr-3" />,
    'REST APIs': <TbApi className="w-4 h-4 text-emerald-500 mr-3" />
  };
  return icons[tech] || <span className="w-2 h-2 bg-primary-400 dark:bg-primary-500 rounded-full mr-3"></span>;
};

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
  const { skills, isLoading } = useSkills();

  return (
    <Section id="skills" title="My Skills">
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
           <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
           <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium tracking-wide animate-pulse">Mapping Skills...</p>
        </div>
      ) : (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {skills.map((skillSet, index) => {
          return (
            <motion.div
              key={skillSet.name}
              variants={itemVariants}
              className="relative group h-full"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur opacity-0 group-hover:opacity-50 transition duration-500 group-hover:duration-200"></div>
              <div className="relative h-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {skillSet.name}
                </h3>
                <ul className="space-y-3">
                  {skillSet.tech.map((tech) => (
                    <li key={tech} className="flex items-center text-gray-600 dark:text-gray-300">
                      {getTechIcon(tech)}
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      )}
    </Section>
  );
}
