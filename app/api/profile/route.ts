import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const update: Record<string, string> = {};
  for (const key of ['display_name','avatar_url','phone','preferred_language']) if (typeof body[key] === 'string') update[key] = body[key];
  if (update.preferred_language && !['fr','ar','en'].includes(update.preferred_language)) return NextResponse.json({ error: 'Langue invalide.' }, { status: 400 });
  update.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('profiles').update(update).eq('id', user.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
