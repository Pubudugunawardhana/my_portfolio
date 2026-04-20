import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { subscribeToAuthChanges } from '../../services/authService';

export function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // The observer runs asynchronously, so we wait before deciding where to route
    const unsubscribe = subscribeToAuthChanges((user) => {
      setIsAuthenticated(!!user);
      setIsChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium">Verifying Credentials...</p>
      </div>
    );
  }

  // If they aren't authenticated, catch them and route them to the login screen
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If they have a valid token, let them proceed
  return children;
}
