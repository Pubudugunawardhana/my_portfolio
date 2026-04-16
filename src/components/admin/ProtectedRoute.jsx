import React from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  // Check if our persistent simple auth token exists
  const isAuthenticated = localStorage.getItem('portfolio_auth') === 'true';

  // If they aren't authenticated, physically catch them and route them to the login screen
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If they have the simple token, let them proceed strictly to their destination inside this wrapper!
  return children;
}
