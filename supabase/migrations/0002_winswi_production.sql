-- WinsWi production foundations: communes, images, moderation, realtime, storage.
create extension if not exists pgcrypto;

create table if not exists public.wilayas (
  code text primary key,
  name_fr text not null,
  name_ar text not null,
  name_en text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.communes (
  id uuid primary key default gen_random_uuid(),
  wilaya_code text not null references public.wilayas(code) on delete cascade,
  name_fr text not null,
  name_ar text,
  name_en text,
  created_at timestamptz not null default now(),
  unique(wilaya_code, name_fr)
);

create index if not exists communes_wilaya_idx on public.communes(wilaya_code);

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text not null,
  public_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists listing_images_listing_idx on public.listing_images(listing_id, sort_order);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete cascade,
  reason text not null,
  details text not null default '',
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  created_at timestamptz not null default now()
);

create table if not exists public.blocked_users (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(blocker_id, blocked_id),
  check(blocker_id <> blocked_id)
);

create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check(role in ('user','assistant','system')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.wilayas enable row level security;
alter table public.communes enable row level security;
alter table public.listing_images enable row level security;
alter table public.reports enable row level security;
alter table public.blocked_users enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

create policy "public can read wilayas" on public.wilayas for select to anon, authenticated using (true);
create policy "public can read communes" on public.communes for select to anon, authenticated using (true);
create policy "public can read active listing images" on public.listing_images for select to anon, authenticated using (exists(select 1 from public.listings l where l.id=listing_id and l.status='active'));
create policy "owners manage listing images" on public.listing_images for all to authenticated using (exists(select 1 from public.listings l where l.id=listing_id and l.owner_id=auth.uid())) with check (exists(select 1 from public.listings l where l.id=listing_id and l.owner_id=auth.uid()));
create policy "users create reports" on public.reports for insert to authenticated with check (reporter_id=auth.uid());
create policy "users read own reports" on public.reports for select to authenticated using (reporter_id=auth.uid());
create policy "users manage own blocks" on public.blocked_users for all to authenticated using (blocker_id=auth.uid()) with check (blocker_id=auth.uid());
create policy "users manage own ai conversations" on public.ai_conversations for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "users read/write own ai messages" on public.ai_messages for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());

-- Storage bucket for listing media. Files remain protected by Storage policies.
insert into storage.buckets (id, name, public) values ('listing-media','listing-media',false) on conflict (id) do nothing;

create policy "authenticated users upload listing media" on storage.objects for insert to authenticated with check (bucket_id='listing-media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "authenticated users read own listing media" on storage.objects for select to authenticated using (bucket_id='listing-media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "authenticated users delete own listing media" on storage.objects for delete to authenticated using (bucket_id='listing-media' and (storage.foldername(name))[1] = auth.uid()::text);

-- Realtime: keep database subscriptions narrow. Broadcast is recommended for high-scale messaging;
-- Postgres Changes is retained for the first release because it is simpler to operate.
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.listings;
