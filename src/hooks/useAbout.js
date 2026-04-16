import { useState, useEffect } from 'react';
import { personalInfo as defaultInfo } from '../data/portfolio';

const initializeStorage = () => {
  const stored = localStorage.getItem('portfolio_about');
  if (stored) {
    return JSON.parse(stored);
  } else {
    localStorage.setItem('portfolio_about', JSON.stringify(defaultInfo));
    return defaultInfo;
  }
};

export function useAbout() {
  const [aboutInfo, setAboutInfo] = useState({});

  useEffect(() => {
    setAboutInfo(initializeStorage());
  }, []);

  const updateAbout = (newData) => {
    setAboutInfo(newData);
    localStorage.setItem('portfolio_about', JSON.stringify(newData));
    window.dispatchEvent(new Event('about_updated'));
  };

  useEffect(() => {
    const handleStorageUpdate = () => {
       setAboutInfo(JSON.parse(localStorage.getItem('portfolio_about')));
    };
    
    window.addEventListener('about_updated', handleStorageUpdate);
    return () => window.removeEventListener('about_updated', handleStorageUpdate);
  }, []);

  return { aboutInfo, updateAbout };
}
