import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../state/useAuth';

export const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
};
