'use client';
import { useEffect, useMemo, useState } from 'react';

type Locale = 'fr'|'ar'|'en';
type WeatherMode = 'auto'|'manual';
type ThemeMode = 'auto'|'light'|'dark'|'midnight'|'sunrise'|'sunny'|'cloudy'|'rainy'|'storm'|'snow';
type Persona = 'neutral'|'feminine'|'masculine'|'child'|'teen'|'young-adult'|'adult'|'senior';

type Weather = { code:number; is_day:number; temperature:number; wind:number; label:string };
const WEATHER_LABELS: Record<Locale, Record<string,string>> = {
  fr:{sunny:'Ensoleillé',cloudy:'Nuageux',rainy:'Pluie',storm:'Orage',snow:'Neige',night:'Nuit',sunrise:'Aube',sunset:'Crépuscule'},
  ar:{sunny:'مشمس',cloudy:'غائم',rainy:'ممطر',storm:'عاصف',snow:'ثلجي',night:'ليل',sunrise:'فجر',sunset:'غروب'},
  en:{sunny:'Sunny',cloudy:'Cloudy',rainy:'Rain',storm:'Storm',snow:'Snow',night:'Night',sunrise:'Dawn',sunset:'Dusk'}
};
function classifyWeather(code:number, isDay:number): ThemeMode { if(!isDay) return 'midnight'; if(code>=95) return 'storm'; if(code>=71) return 'snow'; if(code>=51) return 'rainy'; if(code>=1) return 'cloudy'; return 'sunny'; }

export default function AdaptiveExperience({locale}:{locale:Locale}) {
  const [open,setOpen]=useState(false);
  const [weather,setWeather]=useState<Weather|null>(null);
  const [theme,setTheme]=useState<ThemeMode>('auto');
  const [persona,setPersona]=useState<Persona>('neutral');
  const [weatherMode,setWeatherMode]=useState<WeatherMode>('auto');
  const [country,setCountry]=useState('DZ');
  const [unit,setUnit]=useState<'metric'|'imperial'>('metric');
  const labels = useMemo(()=>({fr:{settings:'Personnaliser WinsWi',theme:'Ambiance',auto:'Automatique',persona:'Profil visuel',country:'Pays',units:'Unités',weather:'Météo',manual:'Manuel',neutral:'Neutre',feminine:'Féminin',masculine:'Masculin',child:'Enfant',teen:'Adolescent',young:'Jeune adulte',adult:'Adulte',senior:'Senior',close:'Fermer'},ar:{settings:'تخصيص WinsWi',theme:'المظهر',auto:'تلقائي',persona:'الملف البصري',country:'الدولة',units:'الوحدات',weather:'الطقس',manual:'يدوي',neutral:'محايد',feminine:'أنثوي',masculine:'ذكوري',child:'طفل',teen:'مراهق',young:'شاب',adult:'بالغ',senior:'كبير السن',close:'إغلاق'},en:{settings:'Personalize WinsWi',theme:'Appearance',auto:'Automatic',persona:'Visual profile',country:'Country',units:'Units',weather:'Weather',manual:'Manual',neutral:'Neutral',feminine:'Feminine',masculine:'Masculine',child:'Child',teen:'Teen',young:'Young adult',adult:'Adult',senior:'Senior',close:'Close'}}[locale]),[locale]);

  useEffect(()=>{
    const read=(k:string,f:string)=>window.localStorage.getItem(k)??f;
    setTheme(read('winswi-theme','auto') as ThemeMode); setPersona(read('winswi-persona','neutral') as Persona); setWeatherMode(read('winswi-weather-mode','auto') as WeatherMode); setCountry(read('winswi-country','DZ')); setUnit(read('winswi-unit','metric') as 'metric'|'imperial');
  },[]);
  useEffect(()=>{
    document.documentElement.dataset.theme = theme === 'auto' ? 'adaptive' : theme;
    document.documentElement.dataset.persona = persona;
    document.documentElement.dataset.country = country;
  },[theme,persona,country]);
  useEffect(()=>{
    if(weatherMode!=='auto') return;
    if(!navigator.geolocation){setWeather(null);return;}
    navigator.geolocation.getCurrentPosition(async p=>{ try { const r=await fetch(`/api/weather?lat=${p.coords.latitude}&lon=${p.coords.longitude}`); if(r.ok)setWeather(await r.json()); } catch {} },()=>{}, {maximumAge:30*60*1000,timeout:7000});
  },[weatherMode]);
  useEffect(()=>{
    if(weatherMode!=='auto') return;
    const time=new Date().getHours();
    const current=weather ? classifyWeather(weather.code,weather.is_day) : (time<6||time>=21?'midnight':time<9?'sunrise':time>=18?'sunset':'sunny');
    document.documentElement.dataset.weather=current;
  },[weather,weatherMode]);
  function save(key:string,value:string){window.localStorage.setItem(key,value);}
  function setT(v:ThemeMode){setTheme(v);save('winswi-theme',v)}
  function setP(v:Persona){setPersona(v);save('winswi-persona',v)}
  function setW(v:WeatherMode){setWeatherMode(v);save('winswi-weather-mode',v)}
  return <>
    <button className="adaptive-trigger" onClick={()=>setOpen(true)} aria-label={labels.settings}>⚙</button>
    {open&&<div className="adaptive-sheet" dir={locale==='ar'?'rtl':'ltr'}>
      <div className="voice-head"><strong>{labels.settings}</strong><button onClick={()=>setOpen(false)}>×</button></div>
      <label>{labels.theme}<select value={theme} onChange={e=>setT(e.target.value as ThemeMode)}><option value="auto">{labels.auto}</option><option value="light">Light</option><option value="dark">Dark</option><option value="midnight">Midnight</option><option value="sunrise">Sunrise</option><option value="sunny">Sunny</option><option value="cloudy">Cloudy</option><option value="rainy">Rain</option><option value="storm">Storm</option><option value="snow">Snow</option></select></label>
      <label>{labels.weather}<select value={weatherMode} onChange={e=>setW(e.target.value as WeatherMode)}><option value="auto">{labels.auto}</option><option value="manual">{labels.manual}</option></select></label>
      <label>{labels.persona}<select value={persona} onChange={e=>setP(e.target.value as Persona)}>{[['neutral',labels.neutral],['feminine',labels.feminine],['masculine',labels.masculine],['child',labels.child],['teen',labels.teen],['young-adult',labels.young],['adult',labels.adult],['senior',labels.senior]].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
      <label>{labels.country}<select value={country} onChange={e=>{setCountry(e.target.value);save('winswi-country',e.target.value)}}><option value="DZ">🇩🇿 Algeria</option><option value="FR">🇫🇷 France</option><option value="MA">🇲🇦 Morocco</option><option value="TN">🇹🇳 Tunisia</option><option value="US">🇺🇸 United States</option><option value="GB">🇬🇧 United Kingdom</option><option value="CA">🇨🇦 Canada</option><option value="AE">🇦🇪 UAE</option><option value="SA">🇸🇦 Saudi Arabia</option><option value="DE">🇩🇪 Germany</option><option value="ES">🇪🇸 Spain</option><option value="IT">🇮🇹 Italy</option></select></label>
      <label>{labels.units}<select value={unit} onChange={e=>{setUnit(e.target.value as 'metric'|'imperial');save('winswi-unit',e.target.value)}}><option value="metric">Metric (km, °C, m²)</option><option value="imperial">Imperial (mi, °F, ft²)</option></select></label>
      {weather&&<div className="adaptive-status">{WEATHER_LABELS[locale][classifyWeather(weather.code,weather.is_day)]} · {Math.round(unit==='metric'?weather.temperature:(weather.temperature*9/5)+32)}° · {Math.round(weather.wind)} km/h</div>}
      <p className="adaptive-note">{locale==='fr'?'Le profil est choisi par vous. WinsWi ne déduit pas votre genre ou votre âge à partir de votre visage ou de votre voix.':locale==='ar'?'أنت تختار الملف بنفسك. لا تستنتج WinsWi العمر أو الجنس من الوجه أو الصوت.':'You choose the profile yourself. WinsWi does not infer age or gender from your face or voice.'}</p>
      <button className="gold-btn full" onClick={()=>setOpen(false)}>{labels.close}</button>
    </div>}
  </>;
}
