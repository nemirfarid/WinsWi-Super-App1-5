import { NextResponse } from 'next/server';
import { buildSocialContent } from '@/lib/social/connectors';
import type { SocialPlatform } from '@/lib/social/connectors';

const platforms = new Set<SocialPlatform>(['facebook','instagram','messenger','tiktok','youtube','whatsapp','linkedin','telegram','pinterest']);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { platform?: string; title?: string; description?: string; price?: number; currency?: string; location?: string; url?: string } | null;
  if (!body || !body.platform || !platforms.has(body.platform as SocialPlatform) || !body.title || !body.url) return NextResponse.json({ error: 'platform, title et url sont requis' }, { status: 400 });
  return NextResponse.json({ platform: body.platform, content: buildSocialContent({ title: body.title, description: body.description ?? '', price: body.price, currency: body.currency, location: body.location, url: body.url }, body.platform as SocialPlatform) });
}
