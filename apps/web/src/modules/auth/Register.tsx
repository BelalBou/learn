import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../state/useAuth';

export const Register: React.FC = () => {
  const { register, token } = useAuth();
  const nav = useNavigate();
  useEffect(()=> { if(token) nav('/'); }, [token, nav]);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [displayName,setDisplayName]=useState('');
  const [error,setError]=useState('');

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    const ok = await register(email,password,displayName);
    if(!ok) setError("Erreur d'inscription"); else nav('/');
  };
  return (
    <form className="card" onSubmit={submit}>
      <h1 style={{marginTop:0, fontSize:'1.55rem'}}>Inscription</h1>
      <p style={{margin:'0 0 1.2rem', fontSize:'.85rem', color:'var(--color-text-dim)'}}>Crée ton compte et suis ta progression.</p>
      {error && <p className="error" role="alert">{error}</p>}
      <label>Pseudo<input value={displayName} onChange={e=>setDisplayName(e.target.value)} required autoComplete="nickname" /></label>
      <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required autoComplete="email" /></label>
      <label>Mot de passe<input value={password} onChange={e=>setPassword(e.target.value)} type="password" required autoComplete="new-password" /></label>
  <button type="submit">Créer le compte</button>
      <p className="muted">Déjà un compte ? <Link to="/login">Connexion</Link></p>
    </form>
  );
};
