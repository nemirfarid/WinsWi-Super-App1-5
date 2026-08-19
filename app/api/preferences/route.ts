import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const body = await request.json();
  const payload = { user_id: user.id, detected_locale: String(body.detected_locale || 'fr'), selected_locale: body.selected_locale ? String(body.selected_locale) : null, auto_detect: body.auto_detect !== false };
  const { error } = await supabase.from('user_language_preferences').upsert(payload, { onConflict: 'user_id' });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
