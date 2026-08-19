'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type Locale = 'fr' | 'ar' | 'en';
type Props = { compact?: boolean; locale?: Locale };

type Recognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: any) => void) | null;
  onend: (() => void) | null;
};

export default function VoiceAssistant({ compact = false, locale = 'fr' }: Props) {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState('');
  const [answer, setAnswer] = useState('');
  const recognition = useRef<Recognition | null>(null);
  const labels = {
    fr: { ask: 'Parlez à WinsWi', hint: 'Je peux rechercher, comparer et agir.', start: 'Parler', stop: 'Arrêter', send: 'Envoyer' },
    ar: { ask: 'تحدث مع WinsWi', hint: 'أستطيع البحث والمقارنة والمساعدة.', start: 'تحدث', stop: 'إيقاف', send: 'إرسال' },
    en: { ask: 'Talk to WinsWi', hint: 'I can search, compare and help.', start: 'Speak', stop: 'Stop', send: 'Send' },
  }[locale];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as typeof window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const r = new SpeechRecognition();
    r.continuous = false;
    r.interimResults = true;
    r.lang = locale === 'ar' ? 'ar-DZ' : locale === 'en' ? 'en-US' : 'fr-FR';
    r.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) transcript += event.results[i][0].transcript;
      setText(transcript);
    };
    r.onend = () => setListening(false);
    recognition.current = r;
    return () => { try { r.abort(); } catch {} };
  }, [locale]);

  function speak(value: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = locale === 'ar' ? 'ar-DZ' : locale === 'en' ? 'en-US' : 'fr-FR';
    window.speechSynthesis.speak(utterance);
  }

  function start() {
    if (!recognition.current) {
      setOpen(true);
      setAnswer(locale === 'fr' ? 'La reconnaissance vocale de votre navigateur n’est pas disponible. Vous pouvez écrire votre demande.' : locale === 'ar' ? 'التعرف الصوتي غير متاح في هذا المتصفح. يمكنك كتابة طلبك.' : 'Speech recognition is not available in this browser. You can type your request.');
      return;
    }
    setOpen(true);
    setListening(true);
    try { recognition.current.start(); } catch { setListening(false); }
  }

  async function send() {
    if (!text.trim()) return;
    setBusy(true);
    try {
      const response = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text }) });
      const data = await response.json();
      const value = data.text || data.error || 'Je n’ai pas pu répondre.';
      setAnswer(value);
      speak(value);
      void fetch('/api/ai/voice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale, transcript: text, response_text: value }) });
    } finally {
      setBusy(false);
    }
  }

  if (!compact) return null;
  return (
    <>
      <button className="ai-orb" onClick={() => { setOpen(true); start(); }} aria-label="WinsWi AI"><span>✦</span><small>IA</small></button>
      {open && (
        <div className="voice-sheet">
          <div className="voice-head"><strong>{labels.ask}</strong><button onClick={() => setOpen(false)} aria-label="Fermer">×</button></div>
          <div className="voice-orb-large">✦</div>
          <p>{labels.hint}</p>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={locale === 'fr' ? 'Ex. Trouve-moi un F3 à Mostaganem…' : locale === 'ar' ? 'مثال: ابحث لي عن شقة F3 في مستغانم…' : 'Example: Find me an F3 in Mostaganem…'} />
          <div className="voice-actions">
            <button className="voice-btn" onClick={listening ? () => { try { recognition.current?.stop(); } catch {} setListening(false); } : start}>{listening ? labels.stop : labels.start}</button>
            <button className="gold-btn" disabled={busy} onClick={send}>{busy ? '…' : labels.send}</button>
          </div>
          {answer && <div className="voice-answer">{answer}<Link href="/demandes">Créer une demande</Link></div>}
        </div>
      )}
    </>
  );
}
