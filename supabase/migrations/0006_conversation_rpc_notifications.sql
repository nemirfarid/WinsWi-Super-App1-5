-- WinsWi v8: safe conversation creation without exposing participant insertion to clients.
create or replace function public.start_conversation(p_recipient_id uuid, p_listing_id uuid default null, p_initial_message text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_conversation uuid;
  v_owner uuid;
begin
  if v_user is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_recipient_id is null or p_recipient_id = v_user then raise exception 'INVALID_RECIPIENT'; end if;
  if not exists (select 1 from public.profiles where id = p_recipient_id) then raise exception 'RECIPIENT_NOT_FOUND'; end if;
  if p_listing_id is not null then
    select owner_id into v_owner from public.listings where id = p_listing_id and status = 'active';
    if v_owner is null or v_owner <> p_recipient_id then raise exception 'INVALID_LISTING'; end if;
  end if;

  select cp1.conversation_id into v_conversation
  from public.conversation_participants cp1
  join public.conversation_participants cp2 on cp2.conversation_id = cp1.conversation_id
  where cp1.user_id = v_user and cp2.user_id = p_recipient_id
  limit 1;

  if v_conversation is null then
    insert into public.conversations default values returning id into v_conversation;
    insert into public.conversation_participants(conversation_id,user_id) values (v_conversation,v_user),(v_conversation,p_recipient_id);
  end if;

  if p_initial_message is not null and length(trim(p_initial_message)) > 0 then
    insert into public.messages(conversation_id,sender_id,body)
    values (v_conversation,v_user,left(trim(p_initial_message),10000));
  end if;
  return v_conversation;
end;
$$;

grant execute on function public.start_conversation(uuid,uuid,text) to authenticated;

-- Notify the other participants after a message is created.
create or replace function public.notify_message_recipients() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications(user_id,type,title,body,data)
  select p.user_id, 'new_message', 'Nouveau message', left(new.body, 180), jsonb_build_object('conversation_id', new.conversation_id, 'message_id', new.id)
  from public.conversation_participants p
  where p.conversation_id = new.conversation_id and p.user_id <> new.sender_id;
  return new;
end;
$$;

drop trigger if exists message_notify_recipients on public.messages;
create trigger message_notify_recipients after insert on public.messages for each row execute function public.notify_message_recipients();

-- Realtime authorization for private conversation topics can be added when Broadcast is enabled.
