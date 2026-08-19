import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  if (typeof body.recipientId !== 'string' || body.recipientId === user.id) return NextResponse.json({ error: 'Destinataire invalide.' }, { status: 400 });
  const { data, error } = await supabase.rpc('start_conversation', {
    p_recipient_id: body.recipientId,
    p_listing_id: typeof body.listingId === 'string' ? body.listingId : null,
    p_initial_message: typeof body.message === 'string' ? body.message : null,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data: { conversationId: data } }, { status: 201 });
}
