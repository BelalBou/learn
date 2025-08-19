import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../state/useAuth';

export const Login: React.FC = () => {
  const { login, token } = useAuth();
  const nav = useNavigate();
  useEffect(()=> { if(token) nav('/'); }, [token, nav]);
  const [email,setEmail]=useState('demo@example.com');
  const [password,setPassword]=useState('password');
  const [error,setError]=useState('');

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    const ok = await login(email,password);
    if(!ok) setError('Identifiants invalides'); else nav('/');
  };
  return (
    <form className="card" onSubmit={submit}>
      <h1 style={{marginTop:0, fontSize:'1.55rem'}}>Connexion</h1>
      <p style={{margin:'0 0 1.2rem', fontSize:'.85rem', color:'var(--color-text-dim)'}}>Accède à ton espace d'apprentissage.</p>
      {error && <p className="error" role="alert">{error}</p>}
      <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required autoComplete="email" /></label>
      <label>Mot de passe<input value={password} onChange={e=>setPassword(e.target.value)} type="password" required autoComplete="current-password" /></label>
  <button type="submit">Se connecter</button>
      <p className="muted">Pas de compte ? <Link to="/register">Inscription</Link></p>
    </form>
  );
};
