import { useState, useEffect } from 'react';
import { 
  listenToCertificationsFromFirebase, 
  addCertificationToFirebase, 
  updateCertificationInFirebase, 
  deleteCertificationFromFirebase 
} from '../services/certificationService';

export function useCertifications() {
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToCertificationsFromFirebase((liveData) => {
      setCertifications(liveData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addCertification = async (data) => {
    await addCertificationToFirebase(data);
  };

  const editCertification = async (id, updatedData) => {
    await updateCertificationInFirebase(id, updatedData);
  };

  const deleteCertification = async (id) => {
    await deleteCertificationFromFirebase(id);
  };

  return { 
    certifications, 
    isLoading, 
    addCertification, 
    editCertification, 
    deleteCertification 
  };
}
