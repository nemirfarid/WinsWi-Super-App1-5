-- WinsWi v9: dashboard activity and conversation timestamps.
create index if not exists notifications_user_unread_idx on public.notifications(user_id, read_at, created_at desc);
create index if not exists buyer_requests_user_status_idx on public.buyer_requests(user_id, status, created_at desc);
create index if not exists favorites_user_created_idx on public.favorites(user_id, created_at desc);
create index if not exists conversation_participants_user_idx on public.conversation_participants(user_id, joined_at desc);
create index if not exists messages_conversation_created_idx on public.messages(conversation_id, created_at desc);

create or replace function public.touch_conversation_on_message() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.conversations set updated_at = new.created_at where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists message_touch_conversation on public.messages;
create trigger message_touch_conversation after insert on public.messages for each row execute function public.touch_conversation_on_message();
