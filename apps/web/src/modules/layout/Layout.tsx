import React, { useEffect, useLayoutEffect } from 'react';
import { Sidebar } from './Sidebar';
import './layout.css';
import { useAuth } from '../state/useAuth';
import { useTheme } from '../state/useTheme';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, logout, email, restore } = useAuth();
  const { toggle, mode, restore: restoreTheme } = useTheme();
  const nav = useNavigate();
  useEffect(()=> { restore(); restoreTheme(); }, [restore, restoreTheme]);
  const [open, setOpen] = useState(false);
  const toggleSidebar = () => setOpen(o=>!o);
  const closeSidebar = () => setOpen(false);
  useLayoutEffect(()=>{
    const handler = () => { if (window.innerWidth > 800) setOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  // Close on ESC
  useEffect(()=>{
    if(!open) return;
    const onKey = (e:KeyboardEvent) => { if(e.key === 'Escape') closeSidebar(); };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <div className="layout-root">
      {token && <Sidebar open={open} onNavigate={closeSidebar} />}
      {token && <div className={`sidebar-overlay ${open ? 'show' : ''}`} onClick={closeSidebar} aria-hidden={!open} />}
      <div style={{display:'flex', flexDirection:'column', flex:1, minWidth:0}}>
        <header className="app-header" style={{display:'flex', flexWrap:'wrap', alignItems:'center', gap:'.75rem', padding:'.55rem 1rem', borderBottom:'1px solid var(--color-border)', background:'var(--color-bg-alt)', position:'sticky', top:0, zIndex:40}}>
          {token && (
            <button
              onClick={toggleSidebar}
              aria-label={open ? 'Fermer la navigation' : 'Ouvrir la navigation'}
              aria-expanded={open}
              className="sidebar-toggle desktop-only"
              style={{
                background:'var(--color-bg-alt2)',
                border:'1px solid var(--color-border)',
                width:'42px',
                height:'42px',
                borderRadius:'12px',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                cursor:'pointer',
                position:'relative',
                overflow:'hidden'
              }}>
              <svg width="20" height="20" viewBox="0 0 24 24" style={{transition:'transform .35s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)'}}>
                <path fill="currentColor" d="M9.29 6.71a1 1 0 0 0 0 1.41L12.17 11l-2.88 2.88a1 1 0 1 0 1.42 1.41l3.59-3.59a1 1 0 0 0 0-1.41L10.71 6.7a1 1 0 0 0-1.42.01Z"/>
              </svg>
              <span style={{position:'absolute', inset:0, background:'radial-gradient(circle at 30% 20%, rgba(96,165,250,.15), transparent 60%)', pointerEvents:'none'}} />
            </button>
          )}
          <strong style={{letterSpacing:'.5px'}}>Learn<span style={{color:'var(--color-accent-alt)'}}>Pro</span></strong>
          <div className="push-right flex items-center gap-sm" style={{flexWrap:'wrap'}}>
            <button className="theme-toggle" aria-label="Basculer le thème" onClick={toggle}>{mode === 'dark' ? '☀️' : '🌙'}</button>
            {!token && (
              <>
                <button onClick={()=> nav('/login')}>Connexion</button>
                <button onClick={()=> nav('/register')}>Inscription</button>
              </>
            )}
            {token && (
              <>
                <span style={{fontSize:'.8rem', opacity:.8}}>{email}</span>
                <button onClick={()=> { logout(); nav('/login'); }}>Déconnexion</button>
              </>
            )}
          </div>
        </header>
        <main className="layout-main" role="main" style={{minWidth:0}}>{children}</main>
        {token && (
          <button
            aria-label="Ouvrir la navigation"
            className={`sidebar-handle ${open ? 'hidden' : ''}`}
            onClick={toggleSidebar}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9.29 6.71a1 1 0 0 0 0 1.41L12.17 11l-2.88 2.88a1 1 0 1 0 1.42 1.41l3.59-3.59a1 1 0 0 0 0-1.41L10.71 6.7a1 1 0 0 0-1.42.01Z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
