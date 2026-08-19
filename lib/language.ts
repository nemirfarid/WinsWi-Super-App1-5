import type { Locale } from '@/types/winswi';

const supported: Locale[] = ['fr','ar','en'];
const aliases: Record<string, Locale> = { fr:'fr', 'fr-fr':'fr', 'fr-dz':'fr', 'fr-ca':'fr', ar:'ar', 'ar-dz':'ar', 'ar-sa':'ar', 'ar-ma':'ar', en:'en', 'en-us':'en', 'en-gb':'en', 'en-ca':'en' };

export function detectLocale(input?: string | null): Locale {
  const raw = String(input || '').trim().toLowerCase();
  if (aliases[raw]) return aliases[raw];
  const base = raw.split(/[-_]/)[0];
  if (supported.includes(base as Locale)) return base as Locale;
  return 'fr';
}

export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return 'fr';
  const values = [navigator.language, ...(navigator.languages || [])];
  for (const value of values) {
    const locale = detectLocale(value);
    if (supported.includes(locale)) return locale;
  }
  return 'fr';
}
