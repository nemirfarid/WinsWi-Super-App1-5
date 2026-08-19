import type { Listing } from '@/types/winswi';

export function scoreListing(listing: Partial<Listing> & { metadata?: Record<string, unknown> }, criteria: Record<string, unknown>): number {
  let score = 0;
  const meta = listing.metadata ?? {};
  const text = `${listing.title ?? ''} ${listing.description ?? ''} ${listing.location ?? ''}`.toLowerCase();
  for (const [key, wanted] of Object.entries(criteria)) {
    if (wanted === undefined || wanted === null || wanted === '') continue;
    const actual = key in listing ? (listing as Record<string, unknown>)[key] : meta[key];
    if (Array.isArray(wanted)) {
      if (wanted.some(x => String(actual ?? '').toLowerCase().includes(String(x).toLowerCase()))) score += 10;
    } else if (typeof wanted === 'number') {
      const n = Number(actual);
      if (!Number.isNaN(n)) score += n === wanted ? 10 : Math.max(0, 10 - Math.abs(n-wanted)/Math.max(1,wanted)*10);
    } else if (String(actual ?? '').toLowerCase().includes(String(wanted).toLowerCase())) score += 10;
    else if (text.includes(String(wanted).toLowerCase())) score += 5;
  }
  return Math.round(score);
}
