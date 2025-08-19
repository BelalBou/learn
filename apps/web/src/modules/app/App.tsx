import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../layout/Layout';
import { LessonView } from '../lesson/LessonView';
import { Home } from '../home/Home';
import { Login } from '../auth/Login';
import { Register } from '../auth/Register';
import { useAuth } from '../state/useAuth';
import { ProtectedRoute } from './ProtectedRoute';

const Landing: React.FC = () => {
  const { token } = useAuth();
  if (token) return <Navigate to="/app" replace />;
  return <Navigate to="/login" replace />;
};

export const App: React.FC = () => {
  const { restore } = useAuth();
  useEffect(()=> { restore(); }, [restore]);
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
  <Route path="/login" element={<Layout><div className="auth-center"><Login /></div></Layout>} />
  <Route path="/register" element={<Layout><div className="auth-center"><Register /></div></Layout>} />
      <Route path="/app" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
      <Route path="/app/lesson/:id" element={<ProtectedRoute><Layout><LessonView /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
