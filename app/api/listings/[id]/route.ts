import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isUniverseId, validateMetadata } from '@/lib/universes';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('listings')
    .select('id,owner_id,universe,title,description,location,wilaya,commune,price,currency,metadata,verified,status,created_at,updated_at,listing_images(id,storage_path,sort_order)')
    .eq('id', id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data || data.status !== 'active') return NextResponse.json({ error: 'Annonce introuvable.' }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  for (const key of ['title','description','location','wilaya','commune','price','currency','status']) {
    if (key in body) patch[key] = body[key];
  }
  if (body.metadata !== undefined) {
    const { data: current } = await supabase.from('listings').select('universe').eq('id', id).eq('owner_id', user.id).single();
    if (!current || !isUniverseId(current.universe)) return NextResponse.json({ error: 'Annonce introuvable.' }, { status: 404 });
    const errors = validateMetadata(current.universe, body.metadata);
    if (errors.length) return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
    patch.metadata = body.metadata;
  }
  if (typeof patch.title === 'string') patch.title = patch.title.trim();
  if (patch.title === '') return NextResponse.json({ error: 'Titre requis.' }, { status: 400 });
  const { data, error } = await supabase.from('listings').update(patch).eq('id', id).eq('owner_id', user.id).select('id,universe,title,description,location,wilaya,commune,price,currency,metadata,verified,status,created_at,updated_at').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const { error } = await supabase.from('listings').update({ status: 'closed' }).eq('id', id).eq('owner_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
