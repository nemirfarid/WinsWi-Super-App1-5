import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const conversationId = new URL(req.url).searchParams.get('conversationId');
  if (!conversationId) return NextResponse.json({ error: 'conversationId requis.' }, { status: 400 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const { data: membership } = await supabase.from('conversation_participants').select('conversation_id').eq('conversation_id', conversationId).eq('user_id', user.id).maybeSingle();
  if (!membership) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  const { data, error } = await supabase.from('messages').select('id,conversation_id,sender_id,body,attachment_url,read_at,created_at').eq('conversation_id', conversationId).order('created_at', { ascending: true }).limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body?.conversationId || typeof body.body !== 'string' || !body.body.trim()) return NextResponse.json({ error: 'Message invalide.' }, { status: 400 });
  const { data: membership } = await supabase.from('conversation_participants').select('conversation_id').eq('conversation_id', body.conversationId).eq('user_id', user.id).maybeSingle();
  if (!membership) return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });
  const { data, error } = await supabase.from('messages').insert({ conversation_id: body.conversationId, sender_id: user.id, body: body.body.trim().slice(0, 10000) }).select('id,conversation_id,sender_id,body,attachment_url,read_at,created_at').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}
