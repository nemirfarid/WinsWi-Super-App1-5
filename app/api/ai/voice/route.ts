import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const locale = String(body.locale || 'fr');
    const transcript = String(body.transcript || '').slice(0, 8000);
    const responseText = String(body.response_text || '').slice(0, 12000);
    if (!transcript) return NextResponse.json({ error: 'Transcript requis.' }, { status: 400 });
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: true, persisted: false });
    const { data: table } = await supabase.from('ai_conversations').select('id').eq('user_id', user.id).eq('title', 'WinsWi Voice').maybeSingle();
    let conversationId = table?.id as string | undefined;
    if (!conversationId) {
      const created = await supabase.from('ai_conversations').insert({ user_id: user.id, title: 'WinsWi Voice' }).select('id').single();
      conversationId = created.data?.id;
    }
    if (!conversationId) return NextResponse.json({ ok: true, persisted: false });
    await supabase.from('ai_voice_sessions').insert({ user_id: user.id, locale, transcript, response_text: responseText });
    await supabase.from('ai_messages').insert([
      { conversation_id: conversationId, role: 'user', content: transcript, metadata: { locale, channel: 'voice' } },
      { conversation_id: conversationId, role: 'assistant', content: responseText, metadata: { locale, channel: 'voice' } },
    ]);
    return NextResponse.json({ ok: true, persisted: true });
  } catch { return NextResponse.json({ ok: true, persisted: false }); }
}
