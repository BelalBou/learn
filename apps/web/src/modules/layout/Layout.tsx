import React from 'react';
import { Sidebar } from './Sidebar';
import './layout.css';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout-root">
      <Sidebar />
      <main className="layout-main" role="main">{children}</main>
    </div>
  );
};
