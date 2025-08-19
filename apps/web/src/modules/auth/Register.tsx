import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../state/useAuth';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const nav = useNavigate();
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
    <form className="card narrow" onSubmit={submit}>
      <h1>Inscription</h1>
      {error && <p className="error" role="alert">{error}</p>}
      <label>Pseudo<input value={displayName} onChange={e=>setDisplayName(e.target.value)} required autoComplete="nickname" /></label>
      <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required autoComplete="email" /></label>
      <label>Mot de passe<input value={password} onChange={e=>setPassword(e.target.value)} type="password" required autoComplete="new-password" /></label>
      <button type="submit">Créer le compte</button>
      <p className="muted">Déjà un compte ? <Link to="/login">Connexion</Link></p>
    </form>
  );
};
