import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { providersForCountry } from '@/lib/payments';

export async function GET(request: Request) {
  const country = new URL(request.url).searchParams.get('country') || 'DZ';
  return NextResponse.json({ country, providers: providersForCountry(country) });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 });
  const body = await request.json();
  const provider = String(body.provider || '');
  const country = String(body.country || 'DZ').toUpperCase();
  const currency = String(body.currency || (country === 'DZ' ? 'DZD' : 'EUR')).toUpperCase();
  const amount = Number(body.amount);
  if (!provider || !Number.isFinite(amount) || amount <= 0) return NextResponse.json({ error: 'Montant ou fournisseur invalide.' }, { status: 400 });
  const allowed = providersForCountry(country).some(p => p.id === provider);
  if (!allowed) return NextResponse.json({ error: 'Fournisseur non disponible pour ce pays.' }, { status: 400 });
  const { data, error } = await supabase.from('payment_transactions').insert({ user_id: user.id, provider, country_code: country, currency, amount, status: 'created', metadata: { source: 'winswi-payment-engine', requires_provider_credentials: true } }).select('id,provider,country_code,currency,amount,status,created_at').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ transaction: data, next_step: 'provider_checkout_required' }, { status: 201 });
}
