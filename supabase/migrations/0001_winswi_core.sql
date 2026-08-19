-- WinsWi core schema: PostgreSQL/Supabase. Safe starting point for the 7 universes.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  phone text,
  preferred_language text not null default 'fr' check (preferred_language in ('fr','ar','en')),
  role text not null default 'user' check (role in ('user','buyer','seller','promoter','agency','professional','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  universe text not null check (universe in ('immo','auto','job','market','build','agri','travel')),
  title text not null,
  description text not null default '',
  location text,
  wilaya text,
  commune text,
  price numeric,
  currency text not null default 'DZD',
  metadata jsonb not null default '{}'::jsonb,
  verified boolean not null default false,
  status text not null default 'active' check (status in ('draft','active','paused','sold','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_universe_idx on public.listings(universe);
create index if not exists listings_location_idx on public.listings(wilaya, commune);
create index if not exists listings_status_idx on public.listings(status);
create index if not exists listings_search_idx on public.listings using gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(description,'')));

create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create table if not exists public.buyer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  universe text not null check (universe in ('immo','auto','job','market','build','agri','travel')),
  title text not null,
  criteria jsonb not null default '{}'::jsonb,
  status text not null default 'open' check (status in ('open','matched','closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null default '',
  read_at timestamptz,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null default '',
  attachment_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public
as $$ begin
  insert into public.profiles (id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1))) on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.favorites enable row level security;
alter table public.buyer_requests enable row level security;
alter table public.notifications enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;

create policy "public can read active listings" on public.listings for select to anon, authenticated using (status='active');
create policy "users manage own listings" on public.listings for all to authenticated using (owner_id=auth.uid()) with check (owner_id=auth.uid());
create policy "users read own profile" on public.profiles for select to authenticated using (id=auth.uid());
create policy "users update own profile" on public.profiles for update to authenticated using (id=auth.uid()) with check (id=auth.uid());
create policy "users manage own favorites" on public.favorites for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "users manage own requests" on public.buyer_requests for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "users read own notifications" on public.notifications for select to authenticated using (user_id=auth.uid());
create policy "users update own notifications" on public.notifications for update to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());

-- Messaging policies: participants can see their conversations and messages.
create policy "participants read conversations" on public.conversations for select to authenticated using (exists (select 1 from public.conversation_participants p where p.conversation_id=id and p.user_id=auth.uid()));
create policy "participants read memberships" on public.conversation_participants for select to authenticated using (user_id=auth.uid() or exists (select 1 from public.conversation_participants p where p.conversation_id=conversation_id and p.user_id=auth.uid()));
create policy "participants read messages" on public.messages for select to authenticated using (exists (select 1 from public.conversation_participants p where p.conversation_id=messages.conversation_id and p.user_id=auth.uid()));
create policy "participants send messages" on public.messages for insert to authenticated with check (sender_id=auth.uid() and exists (select 1 from public.conversation_participants p where p.conversation_id=messages.conversation_id and p.user_id=auth.uid()));
