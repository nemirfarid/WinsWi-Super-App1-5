'use client';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function RealtimeMessages({ conversationId, onMessage }: { conversationId: string; onMessage: (message: unknown) => void }) {
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`conversation:${conversationId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, payload => onMessage(payload.new))
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [conversationId, onMessage]);
  return null;
}
