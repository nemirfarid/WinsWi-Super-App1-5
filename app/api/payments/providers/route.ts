import { NextRequest, NextResponse } from 'next/server';
import { providersForCountry } from '@/lib/payments';
export async function GET(req: NextRequest) {
  const country = (req.nextUrl.searchParams.get('country') || 'DZ').toUpperCase();
  return NextResponse.json({ country, providers: providersForCountry(country) });
}
