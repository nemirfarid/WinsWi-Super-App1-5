-- WinsWi final security hardening.
create index if not exists listings_owner_status_idx on public.listings(owner_id,status,created_at desc);
create index if not exists reports_status_created_idx on public.reports(status,created_at desc);
create index if not exists blocked_users_blocked_idx on public.blocked_users(blocked_id);

-- Prevent a user from creating a favorite for a non-active listing through RLS alone.
drop policy if exists "users manage own favorites" on public.favorites;
create policy "users manage own favorites" on public.favorites for all to authenticated
using (user_id=auth.uid())
with check (user_id=auth.uid() and exists(select 1 from public.listings l where l.id=listing_id and l.status='active'));

-- A blocked relationship prevents new direct conversation creation through the RPC.
create or replace function public.start_conversation(p_recipient_id uuid, p_listing_id uuid default null, p_initial_message text default null)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_user uuid:=auth.uid(); v_owner uuid; v_conversation uuid;
begin
 if v_user is null or p_recipient_id is null or p_recipient_id=v_user then raise exception 'INVALID_PARTICIPANTS'; end if;
 if exists(select 1 from public.blocked_users where (blocker_id=v_user and blocked_id=p_recipient_id) or (blocker_id=p_recipient_id and blocked_id=v_user)) then raise exception 'USER_BLOCKED'; end if;
 if p_listing_id is not null then select owner_id into v_owner from public.listings where id=p_listing_id and status='active'; if v_owner is null or v_owner<>p_recipient_id then raise exception 'INVALID_LISTING'; end if; end if;
 select cp1.conversation_id into v_conversation from public.conversation_participants cp1 join public.conversation_participants cp2 on cp2.conversation_id=cp1.conversation_id where cp1.user_id=v_user and cp2.user_id=p_recipient_id limit 1;
 if v_conversation is null then insert into public.conversations default values returning id into v_conversation; insert into public.conversation_participants(conversation_id,user_id) values(v_conversation,v_user),(v_conversation,p_recipient_id); end if;
 if p_initial_message is not null and length(trim(p_initial_message))>0 then insert into public.messages(conversation_id,sender_id,body) values(v_conversation,v_user,left(trim(p_initial_message),10000)); end if;
 return v_conversation;
end; $$;
grant execute on function public.start_conversation(uuid,uuid,text) to authenticated;
