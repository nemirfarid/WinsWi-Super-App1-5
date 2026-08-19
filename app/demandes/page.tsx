'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { universes } from '@/lib/data';
import type { UniverseId } from '@/types/winswi';

type RequestItem = { id: string; universe: UniverseId; title: string; criteria: Record<string, unknown>; status: string; created_at: string };
type Match = { item: { id: string; universe: UniverseId; title: string; description: string; wilaya?: string | null; commune?: string | null; price?: number | null; currency?: string; verified?: boolean }; score: number };

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [title, setTitle] = useState('');
  const [universe, setUniverse] = useState<UniverseId>('immo');
  const [criteriaText, setCriteriaText] = useState('{"wilaya":"Mostaganem"}');
  const [matches, setMatches] = useState<Match[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const response = await fetch('/api/requests', { cache: 'no-store' });
    if (response.ok) setRequests((await response.json()).data ?? []);
  }

  useEffect(() => { void load(); }, []);

  async function createRequest() {
    setBusy(true); setError('');
    try {
      const criteria = JSON.parse(criteriaText || '{}') as Record<string, unknown>;
      const response = await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, universe, criteria }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Impossible de créer la demande.');
      setTitle('');
      await load();
      await runMatching(data.data.id);
    } catch (e) { setError(e instanceof Error ? e.message : 'Erreur.'); }
    finally { setBusy(false); }
  }

  async function runMatching(requestId: string) {
    setSelected(requestId); setMatches([]); setError('');
    const response = await fetch('/api/matching', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ request_id: requestId }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error || 'Matching impossible.'); return; }
    setMatches(data.data ?? []);
    await load();
  }

  return <main className="wrap">
    <header className="header"><div><div className="brand">WinsWi</div><div className="tag">Mes demandes & matching</div></div><div className="headerActions"><Link className="btn secondary" href="/">Accueil</Link><Link className="btn secondary" href="/dashboard">Mon espace</Link></div></header>
    <section className="hero"><div className="eyebrow">🎯 Matching WinsWi</div><h1>Dites-nous ce que vous cherchez.</h1><p className="tag">WinsWi transforme votre besoin en demande structurée puis recherche les annonces qui correspondent.</p></section>

    {error && <div className="notice error">{error}</div>}
    <section className="card formCard">
      <h2>Créer une demande</h2>
      <div className="formGrid">
        <label>Univers<select value={universe} onChange={e => setUniverse(e.target.value as UniverseId)}>{universes.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
        <label>Titre<input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex. F3 à Mostaganem" /></label>
      </div>
      <label>Critères JSON<textarea value={criteriaText} onChange={e => setCriteriaText(e.target.value)} rows={5} placeholder='{"wilaya":"Mostaganem","transaction":"vente","rooms":3,"max_price":18000000}' /></label>
      <div className="actions"><button className="btn" onClick={() => void createRequest()} disabled={busy || !title.trim()}>{busy ? 'Recherche…' : 'Créer et rechercher'}</button><span className="muted">Exemple : <code>{'{"wilaya":"Mostaganem","rooms":3,"max_price":18000000}'}</code></span></div>
    </section>

    <section className="dashboardSection"><div className="sectionHead"><h2>Mes demandes</h2><span className="muted">{requests.length} demande(s)</span></div>
      {requests.length ? <div className="grid">{requests.map(item => <button key={item.id} className={`card dashboardLink ${selected === item.id ? 'selected' : ''}`} onClick={() => void runMatching(item.id)}><div className="muted">{item.universe} · {new Date(item.created_at).toLocaleDateString('fr-DZ')}</div><h3>{item.title}</h3><span className="badge">{item.status}</span></button>)}</div> : <div className="empty">Aucune demande. Créez votre première demande ci-dessus.</div>}
    </section>

    {selected && <section className="dashboardSection"><div className="sectionHead"><h2>Correspondances</h2><span className="muted">{matches.length} résultat(s)</span></div>
      {matches.length ? <div className="grid">{matches.map(match => <Link className="card dashboardLink" key={match.item.id} href={match.item.universe === 'immo' ? `/immowin/${match.item.id}` : `/universes/${match.item.universe}`}><div className="muted">Score WinsWi : {match.score}% · {match.item.wilaya || 'Algérie'}{match.item.commune ? ` · ${match.item.commune}` : ''}</div><h3>{match.item.title}</h3><p>{match.item.description}</p>{match.item.price != null && <div className="price">{match.item.price.toLocaleString('fr-DZ')} {match.item.currency || 'DZD'}</div>}{match.item.verified && <span className="badge">✓ Vérifié</span>}</Link>)}</div> : <div className="empty">Aucune correspondance suffisamment forte pour le moment.</div>}
    </section>}
  </main>;
}
