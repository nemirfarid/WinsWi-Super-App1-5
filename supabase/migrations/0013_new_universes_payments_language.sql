-- WinsWi 4.2: five new universes, payment orchestration and language preferences.
alter table public.listings drop constraint if exists listings_universe_check;
alter table public.listings add constraint listings_universe_check check (universe in ('immo','auto','job','market','build','agri','travel','education','health','sport','food','delivery'));
alter table public.buyer_requests drop constraint if exists buyer_requests_universe_check;
alter table public.buyer_requests add constraint buyer_requests_universe_check check (universe in ('immo','auto','job','market','build','agri','travel','education','health','sport','food','delivery'));

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  country_code text not null,
  currency text not null,
  amount numeric(18,2) not null check (amount > 0),
  status text not null default 'created' check (status in ('created','requires_action','processing','paid','failed','refunded','cancelled')),
  external_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists payment_transactions_user_idx on public.payment_transactions(user_id, created_at desc);
create index if not exists payment_transactions_provider_idx on public.payment_transactions(provider, status);
alter table public.payment_transactions enable row level security;
drop policy if exists payment_transactions_select_own on public.payment_transactions;
create policy payment_transactions_select_own on public.payment_transactions for select using (auth.uid() = user_id);
drop policy if exists payment_transactions_insert_own on public.payment_transactions;
create policy payment_transactions_insert_own on public.payment_transactions for insert with check (auth.uid() = user_id);

create table if not exists public.user_language_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  detected_locale text not null default 'fr',
  selected_locale text,
  auto_detect boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.user_language_preferences enable row level security;
drop policy if exists language_preferences_own on public.user_language_preferences;
create policy language_preferences_own on public.user_language_preferences for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
