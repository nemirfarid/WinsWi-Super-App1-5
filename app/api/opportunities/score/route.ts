import { NextResponse } from 'next/server';
import { scoreOpportunity } from '@/lib/intelligence/opportunity';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Partial<{ match: number; priceValue: number; location: number; sourceTrust: number; freshness: number; rarity: number }> | null;
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  return NextResponse.json({ score: scoreOpportunity({
    match: Number(body.match ?? 0),
    priceValue: Number(body.priceValue ?? 0),
    location: Number(body.location ?? 0),
    sourceTrust: Number(body.sourceTrust ?? 0),
    freshness: Number(body.freshness ?? 0),
    rarity: Number(body.rarity ?? 0),
  }) });
}
