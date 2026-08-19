import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isUniverseId } from '@/lib/universes';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const { data, error } = await supabase.from('buyer_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  if (typeof body.title !== 'string' || !body.title.trim()) return NextResponse.json({ error: 'title requis.' }, { status: 400 });
  if (typeof body.universe !== 'string' || !isUniverseId(body.universe)) return NextResponse.json({ error: 'univers invalide.' }, { status: 400 });
  const { data, error } = await supabase.from('buyer_requests').insert({ user_id: user.id, title: body.title.trim(), universe: body.universe, criteria: body.criteria && typeof body.criteria === 'object' ? body.criteria : {} }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}
