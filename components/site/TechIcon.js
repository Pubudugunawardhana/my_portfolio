import { FaReact, FaJs, FaHtml5, FaCss3Alt, FaNodeJs, FaPython, FaJava, FaGitAlt, FaDocker, FaAws } from 'react-icons/fa';
import {
  SiExpress, SiDjango, SiPostgresql, SiMongodb, SiRedis, SiFigma, SiFramer, SiTailwindcss, SiMysql,
  SiFirebase, SiC, SiPhp, SiTypescript, SiNextdotjs, SiCplusplus, SiSpringboot, SiFlutter, SiKotlin, SiVercel, SiLinux,
} from 'react-icons/si';
import { TbApi } from 'react-icons/tb';

const ICONS = {
  react: [FaReact, '#61dafb'],
  javascript: [FaJs, '#f7df1e'],
  typescript: [SiTypescript, '#3178c6'],
  html: [FaHtml5, '#e34f26'],
  css: [FaCss3Alt, '#1572b6'],
  'node.js': [FaNodeJs, '#5fa04e'],
  express: [SiExpress, 'currentColor'],
  'next.js': [SiNextdotjs, 'currentColor'],
  python: [FaPython, '#3776ab'],
  django: [SiDjango, '#44b78b'],
  postgresql: [SiPostgresql, '#4169e1'],
  mongodb: [SiMongodb, '#47a248'],
  redis: [SiRedis, '#ff4438'],
  mysql: [SiMysql, '#4479a1'],
  firebase: [SiFirebase, '#ffca28'],
  figma: [SiFigma, '#f24e1e'],
  framer: [SiFramer, 'currentColor'],
  'tailwind css': [SiTailwindcss, '#06b6d4'],
  c: [SiC, '#a8b9cc'],
  'c++': [SiCplusplus, '#00599c'],
  java: [FaJava, '#e76f00'],
  'spring boot': [SiSpringboot, '#6db33f'],
  php: [SiPhp, '#777bb4'],
  flutter: [SiFlutter, '#02569b'],
  kotlin: [SiKotlin, '#7f52ff'],
  git: [FaGitAlt, '#f05032'],
  docker: [FaDocker, '#2496ed'],
  aws: [FaAws, '#ff9900'],
  vercel: [SiVercel, 'currentColor'],
  linux: [SiLinux, 'currentColor'],
  'rest apis': [TbApi, '#10b981'],
};

// Brand color for a tech name (null when unknown or monochrome).
export function techColor(name) {
  const color = ICONS[name?.toLowerCase().trim()]?.[1];
  return color && color !== 'currentColor' ? color : null;
}

export function TechIcon({ name, className = 'h-4 w-4' }) {
  const entry = ICONS[name?.toLowerCase().trim()];
  if (!entry) {
    return (
      <span className={`grid place-items-center rounded-md bg-accent-soft font-mono text-[0.6em] font-bold text-accent ${className}`} aria-hidden>
        {name?.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  const [Icon, color] = entry;
  return <Icon className={className} style={{ color }} aria-hidden />;
}
