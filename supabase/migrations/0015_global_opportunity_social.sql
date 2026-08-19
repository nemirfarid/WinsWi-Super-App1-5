create table if not exists public.external_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier text not null check (tier in ('official-api','partner-feed','seller-feed','licensed-public-data','reference-link')),
  country_codes text[] not null default '{}',
  can_republish boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.external_listings (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.external_sources(id) on delete cascade,
  source_listing_id text,
  source_url text not null,
  universe text not null,
  title text not null,
  normalized_payload jsonb not null default '{}',
  fingerprint text,
  published_at timestamptz,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists external_listings_fingerprint_idx on public.external_listings(fingerprint);
create index if not exists external_listings_universe_idx on public.external_listings(universe);

create table if not exists public.opportunity_matches (
  id uuid primary key default gen_random_uuid(),
  external_listing_id uuid references public.external_listings(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete cascade,
  request_id uuid,
  score numeric(5,2) not null default 0,
  reason jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.social_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null,
  account_label text,
  status text not null default 'pending',
  scopes text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique(user_id, platform, account_label)
);

create table if not exists public.social_publications (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid references public.social_connections(id) on delete set null,
  listing_id uuid references public.listings(id) on delete set null,
  platform text not null,
  status text not null default 'draft',
  content jsonb not null default '{}',
  external_post_id text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.external_sources enable row level security;
alter table public.external_listings enable row level security;
alter table public.opportunity_matches enable row level security;
alter table public.social_connections enable row level security;
alter table public.social_publications enable row level security;

drop policy if exists external_sources_read on public.external_sources;
drop policy if exists external_listings_read on public.external_listings;
drop policy if exists opportunity_matches_read on public.opportunity_matches;
drop policy if exists social_connections_owner on public.social_connections;
drop policy if exists social_publications_owner on public.social_publications;
create policy external_sources_read on public.external_sources for select using (active = true);
create policy external_listings_read on public.external_listings for select using (true);
create policy opportunity_matches_read on public.opportunity_matches for select using (true);
create policy social_connections_owner on public.social_connections for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy social_publications_owner on public.social_publications for select using (exists (select 1 from public.social_connections c where c.id = connection_id and c.user_id = auth.uid()));
