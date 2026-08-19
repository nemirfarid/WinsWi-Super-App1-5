import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (typeof body.path !== 'string' || !body.path) return NextResponse.json({ error: 'path requis.' }, { status: 400 });
  const supabase = await createClient();
  const { data: image } = await supabase.from('listing_images').select('storage_path,listing_id,listings!inner(status)').eq('storage_path', body.path).eq('listings.status', 'active').maybeSingle();
  if (!image) return NextResponse.json({ error: 'Média indisponible.' }, { status: 404 });
  const { data, error } = await supabase.storage.from('listing-media').createSignedUrl(image.storage_path, 3600);
  if (error || !data?.signedUrl) return NextResponse.json({ error: error?.message || 'Média indisponible.' }, { status: 404 });
  return NextResponse.json({ signedUrl: data.signedUrl, expiresIn: 3600 });
}
