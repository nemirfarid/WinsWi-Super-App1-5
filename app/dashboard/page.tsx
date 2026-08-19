import { redirect } from 'next/navigation';
import Dashboard from '@/components/dashboard';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in?next=/dashboard');

  const [profile, listings, favorites, requests, notifications, memberships] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('listings').select('id,universe,title,wilaya,commune,price,currency,status,verified').eq('owner_id', user.id).order('created_at', { ascending: false }),
    supabase.from('favorites').select('listing_id,listings(id,universe,title,wilaya,commune,price,currency,status)').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('buyer_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
    supabase.from('conversation_participants').select('conversation_id,joined_at').eq('user_id', user.id).order('joined_at', { ascending: false }),
  ]);

  if (profile.error) throw new Error(profile.error.message);
  if (listings.error || favorites.error || requests.error || notifications.error || memberships.error) throw new Error('Impossible de charger votre espace WinsWi.');

  const ids = (memberships.data ?? []).map(x => x.conversation_id);
  const conversationsResult = ids.length ? await supabase.from('conversations').select('id,created_at,updated_at').in('id', ids).order('updated_at', { ascending: false }) : { data: [], error: null };
  if (conversationsResult.error) throw new Error(conversationsResult.error.message);

  const normalizedFavorites = (favorites.data ?? []).map((favorite) => ({
    listing_id: favorite.listing_id,
    listings: favorite.listings?.[0] ?? null,
  }));

  return <Dashboard initial={{ user: { id: user.id, email: user.email }, profile: profile.data, listings: listings.data ?? [], favorites: normalizedFavorites, requests: requests.data ?? [], notifications: notifications.data ?? [], conversations: conversationsResult.data ?? [] }} />;
}
