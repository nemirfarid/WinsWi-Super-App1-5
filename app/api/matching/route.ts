import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { scoreListing } from '@/lib/matching';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });

  const requestId = typeof body.request_id === 'string' ? body.request_id : '';
  if (!requestId) return NextResponse.json({ error: 'request_id requis.' }, { status: 400 });

  const { data: buyerRequest, error: requestError } = await supabase
    .from('buyer_requests')
    .select('*')
    .eq('id', requestId)
    .eq('user_id', user.id)
    .single();

  if (requestError || !buyerRequest) return NextResponse.json({ error: 'Demande introuvable.' }, { status: 404 });

  const { data: listings, error } = await supabase
    .from('listings')
    .select('id,owner_id,universe,title,description,location,wilaya,commune,price,currency,metadata,verified,status,created_at')
    .eq('universe', buyerRequest.universe)
    .eq('status', 'active')
    .neq('owner_id', user.id)
    .limit(500);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const ranked = (listings ?? [])
    .map(item => ({ item, score: scoreListing(item, buyerRequest.criteria ?? {}) }))
    .filter(result => result.score >= 15)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30);

  // Mark the request as matched only when meaningful results exist.
  if (ranked.length > 0 && buyerRequest.status === 'open') {
    await supabase.from('buyer_requests').update({ status: 'matched' }).eq('id', requestId).eq('user_id', user.id);
  }

  // Create a compact notification for the requester. Duplicates are intentionally
  // avoided by checking recent notifications for the same request.
  if (ranked.length > 0) {
    const { data: recent } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', user.id)
      .eq('type', 'request_match')
      .contains('data', { request_id: requestId })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (!recent?.length) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'request_match',
        title: 'WinsWi a trouvé des correspondances',
        body: `${ranked.length} annonce(s) correspondent à votre demande « ${buyerRequest.title} ».`,
        data: { request_id: requestId, listing_ids: ranked.slice(0, 10).map(x => x.item.id) },
      });
    }
  }

  return NextResponse.json({
    data: ranked,
    request: { id: buyerRequest.id, status: ranked.length ? 'matched' : buyerRequest.status },
    count: ranked.length,
  });
}
