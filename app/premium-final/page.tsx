import Link from 'next/link';
import { universes } from '@/lib/data';

export default function PremiumFinal() {
 return <main className="page-wrap">
  <section className="screen-hero"><span className="eyebrow">WINSWI PREMIUM</span><h1>Une seule app. Tout un monde.</h1><p>WinsWi réunit ses 12 univers, l’IA native texte et voix, le matching, les services professionnels, le CRM, la publicité, les paiements et la livraison dans une architecture prête pour l’international.</p><div className="hero-actions"><Link className="gold-btn" href="/">Entrer dans WinsWi</Link><Link className="outline-btn" href="/dashboard">Mon espace</Link></div></section>
  <section className="universe-section"><div className="section-title"><div><span className="eyebrow">12 UNIVERS</span><h2>Votre monde WinsWi</h2></div></div><div className="universe-grid">{universes.map(u=><Link className="universe-tile" href={`/universes/${u.id}`} key={u.id}><span>{u.icon}</span><strong>{u.name}</strong><small>{u.desc}</small></Link>)}</div></section>
  <section className="feature-grid"><div><strong>✦ WinsWi AI</strong><p className="muted">Recherche naturelle, recommandations et actions par texte ou voix.</p></div><div><strong>⌁ Matching</strong><p className="muted">Des demandes structurées rapprochées des opportunités pertinentes.</p></div><div><strong>◈ Pro & CRM</strong><p className="muted">Agences, promoteurs, entreprises, leads, équipes et campagnes.</p></div><div><strong>◉ International</strong><p className="muted">Langue, pays, devise, unités, météo et expérience adaptative.</p></div></section>
 </main>
}
