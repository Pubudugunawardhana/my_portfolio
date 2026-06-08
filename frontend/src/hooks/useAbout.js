import { useState, useEffect, useCallback } from 'react';
import { getAboutFromFirebase, updateAboutInFirebase } from '../services/aboutService';

export function useAbout() {
  const [aboutInfo, setAboutInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchAbout = useCallback(async () => {
    try {
      const data = await getAboutFromFirebase();
      setAboutInfo(data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbout();
    window.addEventListener('focus', fetchAbout);
    
    // Polling interval for true real-time effect
    const interval = setInterval(fetchAbout, 5000);
    
    return () => {
      window.removeEventListener('focus', fetchAbout);
      clearInterval(interval);
    };
  }, [fetchAbout]);

  const updateAbout = async (newData) => {
    await updateAboutInFirebase(newData);
    fetchAbout();
  };

  return { aboutInfo, isLoading, updateAbout };
}
