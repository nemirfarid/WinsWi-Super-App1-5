'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignUp() {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState(''); const [message,setMessage]=useState(''); const [busy,setBusy]=useState(false);
  async function submit(e:FormEvent){e.preventDefault();setBusy(true);setMessage(''); const supabase=createClient(); const {data,error}=await supabase.auth.signUp({email,password,options:{data:{display_name:name}}}); setMessage(error?.message ?? (data.session?'Compte créé.':'Compte créé. Vérifiez votre email pour confirmer votre adresse.')); setBusy(false);}
  return <main className="wrap"><section className="hero"><div className="brand">WinsWi</div><h1>Créer un compte</h1><p className="tag">Commencez gratuitement avec WinsWi.</p><form onSubmit={submit} className="authForm"><input required placeholder="Nom" value={name} onChange={e=>setName(e.target.value)}/><input type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><input type="password" required minLength={8} placeholder="Mot de passe (8 caractères minimum)" value={password} onChange={e=>setPassword(e.target.value)}/><button className="btn" disabled={busy}>{busy?'…':'Créer mon compte'}</button>{message&&<div className="notice">{message}</div>}</form><p><Link href="/auth/sign-in">J’ai déjà un compte</Link></p></section></main>;
}
