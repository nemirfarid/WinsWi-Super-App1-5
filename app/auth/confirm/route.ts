import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as 'email' | 'recovery' | 'invite' | 'magiclink' | null;
  if (!tokenHash || !type) return NextResponse.redirect(`${origin}/auth/sign-in?error=invalid_confirmation`);
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
  return NextResponse.redirect(`${origin}${error ? '/auth/sign-in?error=confirmation_failed' : '/'}`);
}
