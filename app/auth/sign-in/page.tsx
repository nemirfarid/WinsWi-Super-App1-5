'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignIn() {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [message,setMessage]=useState(''); const [busy,setBusy]=useState(false);
  async function submit(e:FormEvent){e.preventDefault();setBusy(true);setMessage(''); const {error}=await createClient().auth.signInWithPassword({email,password}); setMessage(error?.message ?? 'Connexion réussie.'); setBusy(false); if(!error) window.location.href='/';}
  return <main className="wrap"><section className="hero"><div className="brand">WinsWi</div><h1>Connexion</h1><p className="tag">Connectez-vous à votre compte WinsWi.</p><form onSubmit={submit} className="authForm"><input type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><input type="password" required placeholder="Mot de passe" value={password} onChange={e=>setPassword(e.target.value)}/><button className="btn" disabled={busy}>{busy?'…':'Se connecter'}</button>{message&&<div className="notice">{message}</div>}</form><p><Link href="/auth/sign-up">Créer un compte</Link></p></section></main>;
}
