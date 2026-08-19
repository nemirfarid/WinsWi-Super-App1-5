import { NextResponse } from 'next/server';
import { searchListings } from '@/lib/data';
import { isUniverseId, validateMetadata } from '@/lib/universes';
import { createClient } from '@/lib/supabase/server';
import type { Listing } from '@/types/winswi';

export const dynamic = 'force-dynamic';

const configured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const rawUniverse = url.searchParams.get('universe');
  const q = url.searchParams.get('q')?.trim() || undefined;
  if (rawUniverse && rawUniverse !== 'all' && !isUniverseId(rawUniverse)) return NextResponse.json({ error: 'Univers invalide' }, { status: 400 });
  const universe = rawUniverse && rawUniverse !== 'all' && isUniverseId(rawUniverse) ? rawUniverse : undefined;
  if (!configured()) {
    const data = searchListings({ universe, q });
    return NextResponse.json({ data, mode: 'demo', count: data.length });
  }
  try {
    const supabase = await createClient();
    let query = supabase.from('listings').select('id,universe,title,description,location,wilaya,commune,price,currency,verified').eq('status', 'active').order('created_at', { ascending: false }).limit(50);
    if (rawUniverse && rawUniverse !== 'all') query = query.eq('universe', rawUniverse);
    if (q) {
      const safe = q.replace(/[%_,()]/g, ' ').trim();
      if (safe) query = query.or(`title.ilike.%${safe}%,description.ilike.%${safe}%,location.ilike.%${safe}%,wilaya.ilike.%${safe}%,commune.ilike.%${safe}%`);
    }
    const { data, error } = await query;
    if (error) throw error;
    const items: Listing[] = (data ?? []).map((x) => ({ ...x, location: x.location ?? ([x.commune, x.wilaya].filter(Boolean).join(', ') || 'Algérie') }));
    return NextResponse.json({ data: items, mode: 'supabase', count: items.length });
  } catch (error) {
    console.error('Supabase listings error', error);
    const data = searchListings({ universe, q });
    return NextResponse.json({ data, mode: 'demo-fallback', count: data.length, warning: 'Supabase indisponible; données de démonstration utilisées.' });
  }
}

export async function POST(req: Request) {
  if (!configured()) return NextResponse.json({ error: 'Supabase n’est pas configuré.' }, { status: 503 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body || !isUniverseId(body.universe) || typeof body.title !== 'string' || !body.title.trim()) return NextResponse.json({ error: 'Données d’annonce invalides.' }, { status: 400 });
  const metadata = body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata) ? body.metadata : {};
  const metadataErrors = validateMetadata(body.universe, metadata);
  if (metadataErrors.length) return NextResponse.json({ error: metadataErrors.join(' ') }, { status: 400 });
  const { data, error } = await supabase.from('listings').insert({ owner_id: user.id, universe: body.universe, title: body.title.trim(), description: typeof body.description === 'string' ? body.description : '', location: typeof body.location === 'string' ? body.location : null, wilaya: typeof body.wilaya === 'string' ? body.wilaya : null, commune: typeof body.commune === 'string' ? body.commune : null, price: typeof body.price === 'number' ? body.price : null, currency: 'DZD', metadata }).select('id,universe,title,description,location,wilaya,commune,price,currency,verified,status,created_at').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}
