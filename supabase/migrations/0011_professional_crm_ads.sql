-- WinsWi v4 professional CRM + advertising + voice history foundation.
create table if not exists public.crm_leads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  contact_user_id uuid references public.profiles(id) on delete set null,
  listing_id uuid references public.listings(id) on delete set null,
  name text not null,
  phone text,
  email text,
  source text not null default 'winswi',
  stage text not null default 'new' check(stage in ('new','contacted','qualified','appointment','visit','negotiation','won','lost')),
  score integer not null default 0 check(score between 0 and 100),
  notes text not null default '',
  next_action_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists crm_leads_owner_stage_idx on public.crm_leads(owner_id, stage, updated_at desc);
create index if not exists crm_leads_listing_idx on public.crm_leads(listing_id);
alter table public.crm_leads enable row level security;
create policy "crm owners manage leads" on public.crm_leads for all to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid());

create table if not exists public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.crm_leads(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check(kind in ('note','call','email','whatsapp','appointment','visit','status')),
  body text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists crm_activities_lead_idx on public.crm_activities(lead_id, created_at desc);
alter table public.crm_activities enable row level security;
create policy "crm owners manage activities" on public.crm_activities for all to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid());

create table if not exists public.ad_campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  universe text not null check(universe in ('immo','auto','job','market','build','agri','travel','global')),
  status text not null default 'draft' check(status in ('draft','pending','active','paused','ended','rejected')),
  objective text not null default 'traffic' check(objective in ('traffic','leads','messages','brand')),
  budget_dzd numeric not null default 0 check(budget_dzd >= 0),
  daily_budget_dzd numeric not null default 0 check(daily_budget_dzd >= 0),
  start_at timestamptz,
  end_at timestamptz,
  targeting jsonb not null default '{}'::jsonb,
  creative jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists ad_campaigns_owner_status_idx on public.ad_campaigns(owner_id,status,created_at desc);
alter table public.ad_campaigns enable row level security;
create policy "ad owners manage campaigns" on public.ad_campaigns for all to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid());

create table if not exists public.ad_events (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.ad_campaigns(id) on delete cascade,
  event_type text not null check(event_type in ('impression','click','lead','message')),
  viewer_id uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists ad_events_campaign_type_idx on public.ad_events(campaign_id,event_type,created_at desc);
alter table public.ad_events enable row level security;
create policy "ad owners read events" on public.ad_events for select to authenticated using(exists(select 1 from public.ad_campaigns c where c.id=campaign_id and c.owner_id=auth.uid()));
create policy "authenticated can create ad events" on public.ad_events for insert to authenticated with check(viewer_id=auth.uid() or viewer_id is null);

create table if not exists public.ai_voice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  locale text not null default 'fr' check(locale in ('fr','ar','en')),
  transcript text not null default '',
  response_text text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists ai_voice_sessions_user_idx on public.ai_voice_sessions(user_id,created_at desc);
alter table public.ai_voice_sessions enable row level security;
create policy "users manage own voice sessions" on public.ai_voice_sessions for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());

-- Shared updated_at trigger.
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;
drop trigger if exists crm_leads_updated_at on public.crm_leads;
create trigger crm_leads_updated_at before update on public.crm_leads for each row execute function public.set_updated_at();
drop trigger if exists ad_campaigns_updated_at on public.ad_campaigns;
create trigger ad_campaigns_updated_at before update on public.ad_campaigns for each row execute function public.set_updated_at();
