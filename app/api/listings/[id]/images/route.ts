import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  if (typeof body.path !== 'string' || !body.path.startsWith(`${user.id}/${id}/`)) return NextResponse.json({ error: 'Chemin média invalide.' }, { status: 400 });
  const { data: listing } = await supabase.from('listings').select('id').eq('id', id).eq('owner_id', user.id).single();
  if (!listing) return NextResponse.json({ error: 'Annonce introuvable.' }, { status: 404 });
  const sortOrder = Number.isInteger(body.sortOrder) ? body.sortOrder : 0;
  const { data, error } = await supabase.from('listing_images').insert({ listing_id: id, storage_path: body.path, sort_order: sortOrder }).select('id,listing_id,storage_path,sort_order').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const { data: image } = await supabase.from('listing_images').select('storage_path').eq('id', body.imageId).eq('listing_id', id).single();
  if (!image) return NextResponse.json({ error: 'Image introuvable.' }, { status: 404 });
  const { data: listing } = await supabase.from('listings').select('id').eq('id', id).eq('owner_id', user.id).single();
  if (!listing) return NextResponse.json({ error: 'Annonce introuvable.' }, { status: 404 });
  const { error } = await supabase.from('listing_images').delete().eq('id', body.imageId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await supabase.storage.from('listing-media').remove([image.storage_path]);
  return NextResponse.json({ ok: true });
}
