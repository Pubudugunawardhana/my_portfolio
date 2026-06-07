import { useState, useEffect, useCallback } from 'react';
import { 
  addCertificationToFirebase, 
  updateCertificationInFirebase, 
  deleteCertificationFromFirebase,
  getCertificationsFromFirebase
} from '../services/certificationService';

export function useCertifications() {
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCertifications = useCallback(async () => {
    try {
      const data = await getCertificationsFromFirebase();
      setCertifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertifications();
    window.addEventListener('focus', fetchCertifications);
    return () => window.removeEventListener('focus', fetchCertifications);
  }, [fetchCertifications]);

  const addCertification = async (data) => {
    await addCertificationToFirebase(data);
    fetchCertifications();
  };

  const editCertification = async (id, updatedData) => {
    await updateCertificationInFirebase(id, updatedData);
    fetchCertifications();
  };

  const deleteCertification = async (id) => {
    await deleteCertificationFromFirebase(id);
    fetchCertifications();
  };

  return { 
    certifications, 
    isLoading, 
    addCertification, 
    editCertification, 
    deleteCertification 
  };
}
