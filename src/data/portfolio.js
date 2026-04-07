import React from 'react';
import {
  Code,
  Layout,
  Server,
  Database,
  Smartphone,
  Palette
} from 'lucide-react';

export const personalInfo = {
  name: "[Your Name]",
  role: "Frontend Developer",
  shortBio: "I build modern web applications.",
  longBio: "I'm a passionate developer with a strong background in web technologies. I love transforming complex problems into simple, beautiful, and intuitive designs. When I'm not coding, you'll find me exploring new technologies or contributing to open source.",
  email: "hello@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
};

export const skills = [
  { name: "Frontend Development", icon: Layout, tech: ["React", "Vue", "Tailwind CSS", "TypeScript"] },
  { name: "Backend Development", icon: Server, tech: ["Node.js", "Express", "Python", "Django"] },
  { name: "Database Management", icon: Database, tech: ["PostgreSQL", "MongoDB", "Redis"] },
  { name: "UI/UX Design", icon: Palette, tech: ["Figma", "Framer", "Prototyping"] },
];

export const projects = [
  {
    title: "E-Commerce Platform",
    description: "A full-featured online store with payment processing, user authentication, and inventory management.",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop",
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    title: "Task Management App",
    description: "A collaborative project management tool featuring real-time updates and drag-and-drop boards.",
    tech: ["React", "Firebase", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1000&auto=format&fit=crop",
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    title: "AI Image Generator",
    description: "A web application that generates unique images using machine learning models and prompts.",
    tech: ["Next.js", "OpenAI API", "PostgreSQL"],
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop",
    githubUrl: "#",
    liveUrl: "#",
  }
];
