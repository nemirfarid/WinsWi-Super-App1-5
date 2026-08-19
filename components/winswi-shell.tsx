'use client';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import VoiceAssistant from '@/components/voice-assistant';
import AdaptiveExperience from '@/components/adaptive-experience';
import { detectBrowserLocale } from '@/lib/language';

export default function WinsWiShell({children}:{children:ReactNode}){
  const [locale,setLocale]=useState<'fr'|'ar'|'en'>('fr');
  useEffect(()=>{const saved=window.localStorage.getItem('winswi-locale') as 'fr'|'ar'|'en'|null; const auto=window.localStorage.getItem('winswi-locale-auto')!=='false'; const detected=detectBrowserLocale(); const next=auto?detected:(saved||detected); setLocale(next); document.documentElement.lang=next; document.documentElement.dir=next==='ar'?'rtl':'ltr'; if(auto) window.localStorage.setItem('winswi-locale',next)},[]);
  const labels={fr:['Accueil','Matching','IA','Messages','Profil'],ar:['الرئيسية','المطابقة','الذكاء','الرسائل','الملف'],en:['Home','Matching','AI','Messages','Profile']}[locale];
  const rtl=locale==='ar';
  function change(v:'fr'|'ar'|'en'){setLocale(v);window.localStorage.setItem('winswi-locale',v);window.localStorage.setItem('winswi-locale-auto','false');document.documentElement.lang=v;document.documentElement.dir=v==='ar'?'rtl':'ltr'} function autoLocale(){const v=detectBrowserLocale();setLocale(v);window.localStorage.setItem('winswi-locale-auto','true');window.localStorage.setItem('winswi-locale',v);document.documentElement.lang=v;document.documentElement.dir=v==='ar'?'rtl':'ltr'}
  return <div className="winswi-app" dir={rtl?'rtl':'ltr'}>
    <div className="top-glow" />
    <div className="winswi-topbar"><Link href="/" className="mini-brand"><span>✦</span> WINSWI</Link><AdaptiveExperience locale={locale}/><Link href="/paiements" className="payment-link">💳</Link><div className="locale-switch"><button onClick={autoLocale} title="Auto">AUTO</button>{(['fr','ar','en'] as const).map(v=><button key={v} className={locale===v?'active':''} onClick={()=>change(v)}>{v.toUpperCase()}</button>)}</div></div>
    {children}
    <nav className="bottom-nav">
      <Link href="/"><span>⌂</span>{labels[0]}</Link><Link href="/demandes"><span>⌁</span>{labels[1]}</Link><VoiceAssistant compact locale={locale}/><Link href="/messages"><span>◌</span>{labels[3]}</Link><Link href="/dashboard"><span>◉</span>{labels[4]}</Link>
    </nav>
  </div>
}
