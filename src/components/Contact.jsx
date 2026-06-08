import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Section } from './Section';
import { listenToAboutFromFirebase } from '../services/aboutService';
import { submitContactMessage } from '../services/messageService';
import { Mail, Send } from 'lucide-react';
import { FaGithub, FaLinkedin, FaMedium } from 'react-icons/fa';

export function Contact() {
  const [personalInfo, setPersonalInfo] = useState({ email: '', github: '', linkedin: '', medium: '' });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const unsub = listenToAboutFromFirebase((data) => {
      if (data) setPersonalInfo(data);
    });
    return () => unsub();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitContactMessage(formData);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' }); // Reset form
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      alert("Uh oh! Failed to send message. Please check the console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="contact" title="Get In Touch">
      <div className="grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Let's talk about your project
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Feel free to reach out for collaborations or just a friendly hello.
              I will try my best to get back to you!
            </p>
          </div>
          
          <div className="space-y-4">
            <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-4 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <span className="text-lg">{personalInfo.email || "hello@example.com"}</span>
            </a>
            {personalInfo.github && (
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
                <FaGithub className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <span className="text-lg">GitHub Profile</span>
            </a>
            )}
            {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
                <FaLinkedin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <span className="text-lg">LinkedIn Profile</span>
            </a>
            )}
            {personalInfo.medium && (
            <a href={personalInfo.medium} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
                <FaMedium className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <span className="text-lg">Medium Blog</span>
            </a>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-6" onSubmit={handleSubmit}>
            {submitSuccess && (
              <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 p-4 rounded-lg text-sm text-center font-medium">
                Message sent successfully! Form tracking synced with Firebase.
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
              <textarea
                id="message"
                rows="4"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white resize-none"
                placeholder="How can I help you?"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-2 py-3 px-6 text-white rounded-lg font-medium transition-colors ${isSubmitting ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'}`}
            >
              <span>{isSubmitting ? 'Sending to Cloud...' : 'Send Message'}</span>
              <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
            </button>
          </form>
        </motion.div>
      </div>
    </Section>
  );
}
