import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { providersForCountry } from '@/lib/payments';
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const amount = Number(body.amount); const currency = String(body.currency || 'DZD').toUpperCase(); const country = String(body.country || 'DZ').toUpperCase(); const provider = String(body.provider || '');
  if (!Number.isFinite(amount) || amount <= 0 || !provider) return NextResponse.json({error:'amount/provider invalid'}, {status:400});
  if (!providersForCountry(country).some(p=>p.id===provider)) return NextResponse.json({error:'Provider indisponible pour ce pays.'},{status:400});
  const supabase = await createClient(); const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:'Authentification requise.'},{status:401});
  return NextResponse.json({status:'requires_provider_activation', payment:{amount,currency,country,provider,reference:`WS-${Date.now()}`,user_id:user.id}, message:'Connecteur sélectionné. Les secrets et contrats du prestataire doivent être configurés côté serveur.'});
}
