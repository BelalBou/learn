import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../state/useAuth';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email,setEmail]=useState('demo@example.com');
  const [password,setPassword]=useState('password');
  const [error,setError]=useState('');

  const submit = async (e:React.FormEvent) => {
    e.preventDefault();
    const ok = await login(email,password);
    if(!ok) setError('Identifiants invalides'); else nav('/');
  };
  return (
    <form className="card narrow" onSubmit={submit}>
      <h1>Connexion</h1>
      {error && <p className="error" role="alert">{error}</p>}
      <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required autoComplete="email" /></label>
      <label>Mot de passe<input value={password} onChange={e=>setPassword(e.target.value)} type="password" required autoComplete="current-password" /></label>
      <button type="submit">Se connecter</button>
      <p className="muted">Pas de compte ? <Link to="/register">Inscription</Link></p>
    </form>
  );
};
