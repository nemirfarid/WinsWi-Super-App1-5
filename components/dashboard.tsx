'use client';

import { useEffect, useState } from 'react';

type DashboardData = {
  user: { id: string; email?: string };
  profile: { display_name: string | null; phone: string | null; preferred_language: string; role: string };
  listings: Array<{ id: string; universe: string; title: string; wilaya: string | null; commune: string | null; price: number | null; currency: string; status: string; verified: boolean }>;
  favorites: Array<{ listing_id: string; listings?: { id: string; universe: string; title: string; wilaya: string | null; commune: string | null; price: number | null; currency: string; status: string } | null }>;
  requests: Array<{ id: string; universe: string; title: string; status: string; created_at: string }>;
  notifications: Array<{ id: string; title: string; body: string; read_at: string | null; created_at: string }>;
  conversations: Array<{ id: string; updated_at: string; created_at: string }>;
};

export default function Dashboard({ initial }: { initial: DashboardData }) {
  const [data, setData] = useState(initial);
  const [profile, setProfile] = useState(initial.profile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function refresh() {
    const response = await fetch('/api/dashboard', { cache: 'no-store' });
    if (response.ok) setData(await response.json());
  }

  async function saveProfile() {
    setSaving(true); setMessage('');
    const response = await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) });
    const body = await response.json();
    setSaving(false);
    if (!response.ok) { setMessage(body.error || 'Impossible de sauvegarder.'); return; }
    setProfile(body.data); setMessage('Profil enregistré.');
  }

  async function markRead(id: string) {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    await refresh();
  }

  useEffect(() => {
    const timer = window.setInterval(() => { void refresh(); }, 30000);
    return () => window.clearInterval(timer);
  }, []);

  return <main className="wrap">
    <header className="header">
      <div><div className="brand">WinsWi</div><div className="tag">Mon espace</div></div>
      <div className="headerActions"><a className="btn secondary" href="/">Accueil</a><form action="/auth/sign-out" method="post"><button className="btn secondary" type="submit">Déconnexion</button></form></div>
    </header>

    <section className="hero">
      <div className="eyebrow">👋 Bienvenue</div>
      <h1>{profile.display_name || data.user.email || 'Utilisateur WinsWi'}</h1>
      <p className="tag">Votre tableau de bord centralise vos annonces, favoris, demandes, messages et notifications.</p>
      <div className="badges"><span className="badge">Rôle : {profile.role}</span><span className="badge">Langue : {profile.preferred_language.toUpperCase()}</span>{(profile.role==='agency'||profile.role==='promoter'||profile.role==='professional'||profile.role==='admin')&&<><a className="badge badge-link" href="/immowin/pro">Espace Pro / CRM</a><a className="badge badge-link" href="/publicite">WinsWi Ads</a></>}</div>
    </section>

    <section className="grid statsGrid">
      <div className="card"><div className="muted">Mes annonces</div><div className="stat">{data.listings.length}</div></div>
      <div className="card"><div className="muted">Favoris</div><div className="stat">{data.favorites.length}</div></div>
      <div className="card"><div className="muted">Demandes</div><div className="stat">{data.requests.length}</div></div>
      <div className="card"><div className="muted">Messages</div><div className="stat">{data.conversations.length}</div></div>
    </section>

    <section className="card dashboardSection">
      <div className="sectionHead"><h2>Mon profil</h2><button className="btn" onClick={() => void saveProfile()} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button></div>
      <div className="formGrid">
        <label>Nom<input value={profile.display_name ?? ''} onChange={e => setProfile({ ...profile, display_name: e.target.value })} /></label>
        <label>Téléphone<input value={profile.phone ?? ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} /></label>
        <label>Langue<select value={profile.preferred_language} onChange={e => setProfile({ ...profile, preferred_language: e.target.value })}><option value="fr">Français</option><option value="ar">العربية</option><option value="en">English</option></select></label>
      </div>
      {message && <div className="notice">{message}</div>}
    </section>

    <section className="dashboardSection"><div className="sectionHead"><h2>Mes annonces</h2><a className="btn" href="/immowin/nouvelle">+ Publier sur ImmoWin</a></div>
      {data.listings.length ? <div className="grid">{data.listings.map(x => <a className="card dashboardLink" key={x.id} href={x.universe === 'immo' ? `/immowin/${x.id}` : `/annonce/${x.id}`}><div className="muted">{x.wilaya || 'Algérie'}{x.commune ? ` · ${x.commune}` : ''}</div><h3>{x.title}</h3><div className="price">{x.price != null ? `${x.price.toLocaleString('fr-DZ')} ${x.currency}` : 'Prix sur demande'}</div><span className="badge">{x.status}</span></a>)}</div> : <div className="empty">Vous n'avez pas encore publié d'annonce.</div>}
    </section>

    <section className="dashboardSection"><div className="sectionHead"><h2>Mes favoris</h2><a className="btn secondary" href="/">Rechercher</a></div>
      {data.favorites.length ? <div className="grid">{data.favorites.map(x => x.listings && <a className="card dashboardLink" key={x.listing_id} href={x.listings.universe === 'immo' ? `/immowin/${x.listing_id}` : `/annonce/${x.listing_id}`}><div className="muted">{x.listings.wilaya || 'Algérie'}</div><h3>{x.listings.title}</h3><div className="price">{x.listings.price != null ? `${x.listings.price.toLocaleString('fr-DZ')} ${x.listings.currency}` : 'Prix sur demande'}</div></a>)}</div> : <div className="empty">Aucun favori pour le moment.</div>}
    </section>

    <section className="dashboardSection"><div className="sectionHead"><h2>Mes demandes</h2><a className="btn" href="/demandes">+ Nouvelle demande</a></div>
      {data.requests.length ? <div className="grid">{data.requests.map(x => <div className="card" key={x.id}><div className="muted">{x.universe}</div><h3>{x.title}</h3><span className="badge">{x.status}</span></div>)}</div> : <div className="empty">Aucune demande active.</div>}
    </section>

    <section className="dashboardSection"><div className="sectionHead"><h2>Messages</h2><span className="muted">Actualisation automatique</span></div>
      {data.conversations.length ? <div className="grid">{data.conversations.map(x => <a className="card dashboardLink" key={x.id} href={`/messages/${x.id}`}><h3>Conversation</h3><div className="muted">Dernière activité : {new Date(x.updated_at).toLocaleString('fr-DZ')}</div></a>)}</div> : <div className="empty">Aucune conversation.</div>}
    </section>

    <section className="dashboardSection"><div className="sectionHead"><h2>Notifications</h2><span className="muted">{data.notifications.filter(x => !x.read_at).length} non lue(s)</span></div>
      {data.notifications.length ? <div className="notificationList">{data.notifications.map(x => <button className={`card notification ${x.read_at ? '' : 'unread'}`} key={x.id} onClick={() => !x.read_at && void markRead(x.id)}><strong>{x.title}</strong><div>{x.body}</div><small className="muted">{new Date(x.created_at).toLocaleString('fr-DZ')}</small></button>)}</div> : <div className="empty">Aucune notification.</div>}
    </section>
  </main>;
}
