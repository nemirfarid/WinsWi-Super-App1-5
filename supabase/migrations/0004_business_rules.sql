-- WinsWi business rules: ownership, request matching helpers, notification automation and safer messaging.
create index if not exists messages_conversation_created_idx on public.messages(conversation_id, created_at desc);
create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);
create index if not exists listing_images_owner_lookup_idx on public.listing_images(listing_id, sort_order);

-- Keep conversation timestamp current when a message arrives.
create or replace function public.touch_conversation_on_message() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.conversations set updated_at = now() where id = new.conversation_id;
  return new;
end; $$;

drop trigger if exists messages_touch_conversation on public.messages;
create trigger messages_touch_conversation after insert on public.messages for each row execute function public.touch_conversation_on_message();

-- Notify listing owners when a new buyer request is created in their universe.
create or replace function public.notify_matching_owners() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications(user_id,type,title,body,data)
  select l.owner_id, 'new_request', 'Nouvelle demande WinsWi',
         'Une demande correspond à votre univers.', jsonb_build_object('request_id', new.id, 'listing_id', l.id)
  from public.listings l
  where l.owner_id is not null and l.owner_id <> new.user_id and l.universe = new.universe and l.status = 'active'
  limit 20;
  return new;
end; $$;

drop trigger if exists buyer_request_notify_owners on public.buyer_requests;
create trigger buyer_request_notify_owners after insert on public.buyer_requests for each row execute function public.notify_matching_owners();

-- Prevent users from marking another user's message as read.
drop policy if exists "participants update messages" on public.messages;
create policy "participants update messages" on public.messages for update to authenticated
using (exists (select 1 from public.conversation_participants p where p.conversation_id=messages.conversation_id and p.user_id=auth.uid()))
with check (exists (select 1 from public.conversation_participants p where p.conversation_id=messages.conversation_id and p.user_id=auth.uid()));
