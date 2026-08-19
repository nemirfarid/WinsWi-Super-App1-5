import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const { data, error } = await supabase.from('favorites').select('listing_id,created_at').eq('user_id', user.id).order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  if (typeof body.listingId !== 'string') return NextResponse.json({ error: 'listingId requis.' }, { status: 400 });
  const { error } = await supabase.from('favorites').upsert({ user_id: user.id, listing_id: body.listingId });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  if (typeof body.listingId !== 'string') return NextResponse.json({ error: 'listingId requis.' }, { status: 400 });
  const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('listing_id', body.listingId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
