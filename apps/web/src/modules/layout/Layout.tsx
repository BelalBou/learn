import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import './layout.css';
import { useAuth } from '../state/useAuth';
import { useTheme } from '../state/useTheme';
import { Link, useNavigate } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, logout, email, restore } = useAuth();
  const { toggle, mode, restore: restoreTheme } = useTheme();
  const nav = useNavigate();
  useEffect(()=> { restore(); restoreTheme(); }, [restore, restoreTheme]);
  return (
    <div className="layout-root">
      {token && <Sidebar />}
      <div style={{display:'flex', flexDirection:'column', flex:1}}>
        <header style={{display:'flex', alignItems:'center', gap:'.75rem', padding:'.6rem 1rem', borderBottom:'1px solid var(--color-border)', background:'var(--color-bg-alt)', position:'sticky', top:0, zIndex:40}}>
          <strong style={{letterSpacing:'.5px'}}>Learn<span style={{color:'var(--color-accent-alt)'}}>Pro</span></strong>
          <div className="push-right flex items-center gap-sm">
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
        <main className="layout-main" role="main">{children}</main>
      </div>
    </div>
  );
};
