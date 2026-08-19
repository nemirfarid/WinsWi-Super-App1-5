import { NextRequest, NextResponse } from 'next/server';
import { detectLocale } from '@/lib/language';
import { createClient } from '@/lib/supabase/server';
export async function GET(req: NextRequest) {
  const header = req.headers.get('accept-language');
  const query = req.nextUrl.searchParams.get('lang');
  const locale = detectLocale(query || header?.split(',')[0] || '');
  return NextResponse.json({ locale, source: query ? 'query' : 'accept-language' });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const detected_locale = detectLocale(String(body.detected_locale || req.headers.get('accept-language')?.split(',')[0] || ''));
  const selected_locale = body.selected_locale ? detectLocale(String(body.selected_locale)) : null;
  const auto_detect = body.auto_detect !== false;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const { error } = await supabase.from('user_language_preferences').upsert({ user_id: user.id, detected_locale, selected_locale, auto_detect, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ detected_locale, selected_locale, auto_detect });
}
