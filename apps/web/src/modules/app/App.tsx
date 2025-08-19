import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../layout/Layout';
import { LessonView } from '../lesson/LessonView';
import { Home } from '../home/Home';
import { Login } from '../auth/Login';
import { Register } from '../auth/Register';
import { useAuth } from '../state/useAuth';

export const App: React.FC = () => {
  const { restore } = useAuth();
  useEffect(()=> { restore(); }, [restore]);
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lesson/:id" element={<LessonView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};
