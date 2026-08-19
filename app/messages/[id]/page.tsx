'use client';
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ConversationPage(){
  const { id } = useParams<{id:string}>();
  const [messages,setMessages]=useState<any[]>([]); const [body,setBody]=useState(''); const [error,setError]=useState('');
  async function load(){const r=await fetch(`/api/messages?conversationId=${id}`,{cache:'no-store'});const d=await r.json();if(!r.ok){setError(d.error||'Erreur');return;}setMessages(d.data||[])}
  useEffect(()=>{void load();const s=createClient();const ch=s.channel(`conversation:${id}`).on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:`conversation_id=eq.${id}`},payload=>setMessages(x=>x.some(m=>m.id===payload.new.id)?x:[...x,payload.new])).subscribe();return()=>{void s.removeChannel(ch)}},[id]);
  async function send(e:FormEvent){e.preventDefault();if(!body.trim())return;const text=body;setBody('');const r=await fetch('/api/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({conversationId:id,body:text})});if(!r.ok){const d=await r.json();setError(d.error||'Erreur');setBody(text);}}
  return <main className="wrap"><header className="header"><div><div className="brand">WinsWi · Messages</div><div className="tag">Conversation</div></div><a className="btn secondary" href="/">Accueil</a></header><section className="card"><div className="messageList">{messages.map(m=><div className="message" key={m.id}><div>{m.body}</div><small className="muted">{new Date(m.created_at).toLocaleString('fr-DZ')}</small></div>)}{!messages.length&&<div className="empty">Aucun message.</div>}</div>{error&&<div className="notice error">{error}</div>}<form className="messageComposer" onSubmit={send}><input value={body} onChange={e=>setBody(e.target.value)} placeholder="Votre message…" maxLength={10000}/><button className="btn">Envoyer</button></form></section></main>;
}
