'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { universeFields } from '@/lib/universes';

export default function NewImmo() {
  const router = useRouter();
  const [form, setForm] = useState({ title:'', description:'', location:'', wilaya:'', commune:'', price:'', propertyType:'appartement', transaction:'vente', rooms:'', surfaceM2:'', furnished:false });
  const [files,setFiles]=useState<File[]>([]); const [busy,setBusy]=useState(false); const [message,setMessage]=useState('');
  function set(k:string,v:unknown){setForm(f=>({...f,[k]:v}));}
  async function submit(e:FormEvent){e.preventDefault();setBusy(true);setMessage('');
    try { const metadata={propertyType:form.propertyType,transaction:form.transaction,rooms:form.rooms?Number(form.rooms):undefined,surfaceM2:form.surfaceM2?Number(form.surfaceM2):undefined,furnished:form.furnished};
      const r=await fetch('/api/listings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({universe:'immo',title:form.title,description:form.description,location:form.location,wilaya:form.wilaya,commune:form.commune,price:form.price?Number(form.price):undefined,metadata})});
      const d=await r.json(); if(!r.ok) throw new Error(d.error||'Erreur');
      const supabase=createClient();
      for(let i=0;i<files.length;i++){const file=files[i]; const safe=file.name.toLowerCase().replace(/[^a-z0-9._-]/g,'-'); const {data:{user}}=await supabase.auth.getUser(); if(!user) continue; const realPath=`${user.id}/${d.data.id}/${crypto.randomUUID()}-${safe}`; const up=await supabase.storage.from('listing-media').upload(realPath,file,{upsert:false,contentType:file.type}); if(!up.error) await fetch(`/api/listings/${d.data.id}/images`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:realPath,sortOrder:i})}); }
      router.push(`/immowin/${d.data.id}`);
    } catch(e){setMessage(e instanceof Error?e.message:'Erreur');} finally{setBusy(false);}
  }
  return <main className="wrap"><header className="header"><div><div className="brand">WinsWi · ImmoWin</div><div className="tag">Publier une annonce immobilière</div></div><a className="btn secondary" href="/">Accueil</a></header><section className="card formCard"><h1>Nouvelle annonce</h1><form onSubmit={submit} className="authForm"><input required placeholder="Titre" value={form.title} onChange={e=>set('title',e.target.value)}/><textarea required placeholder="Description" value={form.description} onChange={e=>set('description',e.target.value)}/><div className="formGrid"><input placeholder="Wilaya" value={form.wilaya} onChange={e=>set('wilaya',e.target.value)}/><input placeholder="Commune" value={form.commune} onChange={e=>set('commune',e.target.value)}/><input placeholder="Localisation" value={form.location} onChange={e=>set('location',e.target.value)}/><input type="number" min="0" placeholder="Prix DZD" value={form.price} onChange={e=>set('price',e.target.value)}/><select value={form.propertyType} onChange={e=>set('propertyType',e.target.value)}>{universeFields.immo.find(x=>x.key==='propertyType')?.options?.map(x=><option key={x}>{x}</option>)}</select><select value={form.transaction} onChange={e=>set('transaction',e.target.value)}><option>vente</option><option>location</option></select><input type="number" min="0" placeholder="Pièces" value={form.rooms} onChange={e=>set('rooms',e.target.value)}/><input type="number" min="0" placeholder="Surface m²" value={form.surfaceM2} onChange={e=>set('surfaceM2',e.target.value)}/></div><label><input type="checkbox" checked={form.furnished} onChange={e=>set('furnished',e.target.checked)}/> Meublé</label><input type="file" accept="image/*" multiple onChange={e=>setFiles(Array.from(e.target.files??[]).slice(0,10))}/>{files.length>0&&<div className="muted">{files.length} photo(s) sélectionnée(s)</div>}{message&&<div className="notice error">{message}</div>}<button className="btn" disabled={busy}>{busy?'Publication…':'Publier l’annonce'}</button></form></section></main>;
}
