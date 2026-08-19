'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { paymentProviders, providersForCountry } from '@/lib/payments';

const countries=[['DZ','🇩🇿 Algérie'],['FR','🇫🇷 France'],['MA','🇲🇦 Maroc'],['TN','🇹🇳 Tunisie'],['AE','🇦🇪 Émirats arabes unis'],['GB','🇬🇧 Royaume-Uni'],['US','🇺🇸 États-Unis'],['CA','🇨🇦 Canada'],['DE','🇩🇪 Allemagne'],['ES','🇪🇸 Espagne'],['IT','🇮🇹 Italie']];
export default function PaymentsPage(){
 const [country,setCountry]=useState('DZ'); const list=useMemo(()=>providersForCountry(country),[country]);
 return <main className="wrap"><header className="header"><div><div className="brand">WinsWi Pay</div><div className="tag">Paiements locaux et internationaux</div></div><Link className="btn secondary" href="/">Accueil</Link></header>
 <section className="hero"><div className="eyebrow">💳 WINSWI PAYMENTS</div><h1>Un portefeuille de moyens de paiement, adapté au pays.</h1><p>WinsWi choisit les moyens disponibles selon le pays, la devise, l’univers et le type de transaction. Les connecteurs nécessitant un contrat ou une licence restent isolés derrière des adaptateurs.</p><select value={country} onChange={e=>setCountry(e.target.value)}>{countries.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></section>
 <section className="dashboardSection"><div className="sectionHead"><h2>Modes disponibles pour {country}</h2><span className="muted">{list.length} connecteurs</span></div><div className="grid">{list.map(p=><article className="card" key={p.id}><div className="eyebrow">{p.mode.toUpperCase()}</div><h3>{p.name}</h3><p className="muted">{p.note}</p><div className="badges"><span className="badge">{p.status}</span>{p.currencies.slice(0,4).map(c=><span className="badge" key={c}>{c}</span>)}</div></article>)}</div></section>
 <section className="card dashboardSection"><h2>Architecture de paiement</h2><p className="muted">Checkout → Payment Intent → fournisseur → webhook signé → transaction WinsWi → facture/commission → remboursement éventuel. Aucun secret fournisseur n'est exposé au navigateur.</p></section>
 </main>
}
