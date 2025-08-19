import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../layout/Layout';
import { LessonView } from '../lesson/LessonView';
import { Home } from '../home/Home';
import { Login } from '../auth/Login';
import { Register } from '../auth/Register';

export const App: React.FC = () => {
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
