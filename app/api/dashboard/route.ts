import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const [profile, listings, favorites, requests, notifications, memberships] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('listings').select('id,universe,title,description,wilaya,commune,price,currency,status,verified,created_at,updated_at').eq('owner_id', user.id).order('created_at', { ascending: false }).limit(100),
    supabase.from('favorites').select('listing_id,created_at,listings(id,universe,title,wilaya,commune,price,currency,status,verified)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(100),
    supabase.from('buyer_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(100),
    supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
    supabase.from('conversation_participants').select('conversation_id,joined_at').eq('user_id', user.id).order('joined_at', { ascending: false }).limit(100),
  ]);
  if (profile.error) return NextResponse.json({ error: profile.error.message }, { status: 500 });
  if (listings.error || favorites.error || requests.error || notifications.error || memberships.error) return NextResponse.json({ error: 'Impossible de charger le tableau de bord.' }, { status: 500 });
  const ids = (memberships.data ?? []).map(x => x.conversation_id);
  let conversations: unknown[] = [];
  if (ids.length) {
    const result = await supabase.from('conversations').select('id,created_at,updated_at').in('id', ids).order('updated_at', { ascending: false });
    if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
    conversations = result.data ?? [];
  }
  return NextResponse.json({ user: { id: user.id, email: user.email }, profile: profile.data, listings: listings.data ?? [], favorites: favorites.data ?? [], requests: requests.data ?? [], notifications: notifications.data ?? [], conversations });
}
