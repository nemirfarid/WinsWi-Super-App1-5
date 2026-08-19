import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { demoCommunes } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wilaya = searchParams.get('wilaya');
  const q = searchParams.get('q');
  const supabase = await createClient();
  if (supabase) {
    let query = supabase.from('communes').select('id,wilaya_code,name_fr,name_ar,name_en').order('name_fr');
    if (wilaya) query = query.eq('wilaya_code', wilaya);
    if (q) query = query.ilike('name_fr', `%${q}%`);
    const { data, error } = await query.limit(100);
    if (!error) return NextResponse.json({ data: data ?? [] });
  }
  return NextResponse.json({ data: demoCommunes.filter(x => !wilaya || x.wilaya_code === wilaya).filter(x => !q || x.name_fr.toLowerCase().includes(q.toLowerCase())) });
}
