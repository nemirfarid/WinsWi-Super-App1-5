-- WinsWi Premium Final foundation: international catalog, professional identities,
-- full universe advertising, payment reconciliation metadata and accessibility prefs.

alter table public.ad_campaigns drop constraint if exists ad_campaigns_universe_check;
alter table public.ad_campaigns add constraint ad_campaigns_universe_check
check (universe in ('immo','auto','job','market','build','agri','travel','education','health','sport','food','delivery','global'));

create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  business_type text not null check (business_type in ('agency','promoter','company','professional','restaurant','merchant','clinic','school','club','delivery_operator','other')),
  legal_name text,
  display_name text not null,
  description text not null default '',
  country_code text not null default 'DZ',
  currency text not null default 'DZD',
  phone text,
  email text,
  website text,
  address text,
  verified boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists business_profiles_owner_idx on public.business_profiles(owner_id, created_at desc);
create index if not exists business_profiles_country_idx on public.business_profiles(country_code, business_type);
alter table public.business_profiles enable row level security;
drop policy if exists business_profiles_owner on public.business_profiles;
create policy business_profiles_owner on public.business_profiles for all to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid());

drop trigger if exists business_profiles_updated_at on public.business_profiles;
create trigger business_profiles_updated_at before update on public.business_profiles for each row execute function public.set_updated_at();

create table if not exists public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business_profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  member_role text not null default 'agent' check(member_role in ('owner','admin','manager','agent','staff')),
  created_at timestamptz not null default now(),
  unique(business_id,user_id)
);
create index if not exists business_members_user_idx on public.business_members(user_id,business_id);
alter table public.business_members enable row level security;
drop policy if exists business_members_access on public.business_members;
create policy business_members_access on public.business_members for all to authenticated
using (user_id=auth.uid() or exists(select 1 from public.business_profiles b where b.id=business_id and b.owner_id=auth.uid()))
with check (user_id=auth.uid() or exists(select 1 from public.business_profiles b where b.id=business_id and b.owner_id=auth.uid()));

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payment_transaction_id uuid references public.payment_transactions(id) on delete set null,
  invoice_number text not null unique,
  currency text not null,
  subtotal numeric(18,2) not null default 0,
  tax numeric(18,2) not null default 0,
  total numeric(18,2) not null default 0,
  status text not null default 'issued' check(status in ('draft','issued','paid','void','refunded')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.invoices enable row level security;
drop policy if exists invoices_own on public.invoices;
create policy invoices_own on public.invoices for select to authenticated using(user_id=auth.uid());

create table if not exists public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  external_event_id text not null,
  signature_valid boolean not null default false,
  payload jsonb not null default '{}'::jsonb,
  processed boolean not null default false,
  created_at timestamptz not null default now(),
  unique(provider,external_event_id)
);
alter table public.payment_webhook_events enable row level security;

create table if not exists public.country_catalog (
  code char(2) primary key,
  name_en text not null,
  name_fr text not null,
  name_ar text not null,
  default_currency char(3) not null,
  measurement_system text not null default 'metric' check(measurement_system in ('metric','imperial')),
  default_locale text not null default 'en',
  timezone text,
  active boolean not null default true
);

insert into public.country_catalog(code,name_en,name_fr,name_ar,default_currency,measurement_system,default_locale,timezone) values
('DZ','Algeria','Algérie','الجزائر','DZD','metric','fr','Africa/Algiers'),
('FR','France','France','فرنسا','EUR','metric','fr','Europe/Paris'),
('MA','Morocco','Maroc','المغرب','MAD','metric','fr','Africa/Casablanca'),
('TN','Tunisia','Tunisie','تونس','TND','metric','fr','Africa/Tunis'),
('AE','United Arab Emirates','Émirats arabes unis','الإمارات','AED','metric','ar','Asia/Dubai'),
('SA','Saudi Arabia','Arabie saoudite','السعودية','SAR','metric','ar','Asia/Riyadh'),
('GB','United Kingdom','Royaume-Uni','المملكة المتحدة','GBP','metric','en','Europe/London'),
('US','United States','États-Unis','الولايات المتحدة','USD','imperial','en','America/New_York'),
('CA','Canada','Canada','كندا','CAD','metric','en','America/Toronto'),
('DE','Germany','Allemagne','ألمانيا','EUR','metric','de','Europe/Berlin'),
('ES','Spain','Espagne','إسبانيا','EUR','metric','es','Europe/Madrid'),
('IT','Italy','Italie','إيطاليا','EUR','metric','it','Europe/Rome'),
('BE','Belgium','Belgique','بلجيكا','EUR','metric','fr','Europe/Brussels'),
('NL','Netherlands','Pays-Bas','هولندا','EUR','metric','en','Europe/Amsterdam'),
('PT','Portugal','Portugal','البرتغال','EUR','metric','pt','Europe/Lisbon'),
('CH','Switzerland','Suisse','سويسرا','CHF','metric','fr','Europe/Zurich'),
('TR','Türkiye','Turquie','تركيا','TRY','metric','en','Europe/Istanbul'),
('QA','Qatar','Qatar','قطر','QAR','metric','ar','Asia/Qatar'),
('EG','Egypt','Égypte','مصر','EGP','metric','ar','Africa/Cairo'),
('AU','Australia','Australie','أستراليا','AUD','metric','en','Australia/Sydney')
on conflict(code) do update set name_en=excluded.name_en,name_fr=excluded.name_fr,name_ar=excluded.name_ar,default_currency=excluded.default_currency,measurement_system=excluded.measurement_system,default_locale=excluded.default_locale,timezone=excluded.timezone;

alter table public.profiles add column if not exists country_code text default 'DZ';
alter table public.profiles add column if not exists preferred_currency text default 'DZD';
alter table public.profiles add column if not exists accessibility jsonb not null default '{}'::jsonb;
