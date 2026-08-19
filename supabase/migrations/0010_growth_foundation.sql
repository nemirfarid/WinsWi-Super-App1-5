-- WinsWi growth foundations: alerts, plans and subscriptions. Payments remain provider-neutral.
create table if not exists public.alerts (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
 universe text not null check(universe in ('immo','auto','job','market','build','agri','travel')),
 title text not null, criteria jsonb not null default '{}'::jsonb, enabled boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists alerts_user_enabled_idx on public.alerts(user_id,enabled,created_at desc);
alter table public.alerts enable row level security;
create policy "users manage own alerts" on public.alerts for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());

create table if not exists public.plans (
 id text primary key, name text not null, price_dzd numeric not null default 0, period text not null check(period in ('month','year','one_time')),
 features jsonb not null default '[]'::jsonb, active boolean not null default true
);
create table if not exists public.subscriptions (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
 plan_id text not null references public.plans(id), status text not null check(status in ('trial','active','past_due','cancelled','expired')),
 started_at timestamptz not null default now(), ends_at timestamptz, created_at timestamptz not null default now()
);
alter table public.plans enable row level security; alter table public.subscriptions enable row level security;
create policy "public read active plans" on public.plans for select to anon,authenticated using(active=true);
create policy "users read own subscriptions" on public.subscriptions for select to authenticated using(user_id=auth.uid());
create policy "users create own subscription" on public.subscriptions for insert to authenticated with check(user_id=auth.uid());
insert into public.plans(id,name,price_dzd,period,features) values
('free','WinsWi Free',0,'month','["Recherche","Favoris","Demandes"]'),
('plus','WinsWi Plus',999,'month','["IA avancée","Alertes","Matching prioritaire"]'),
('pro','WinsWi Pro',2499,'month','["Profil professionnel","Outils avancés","Priorité commerciale"]')
on conflict(id) do update set name=excluded.name,price_dzd=excluded.price_dzd,period=excluded.period,features=excluded.features;

create or replace function public.notify_alert_owners() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.notifications(user_id,type,title,body,data)
 select a.user_id,'alert_match','Nouvelle correspondance WinsWi',left(new.title,180),jsonb_build_object('listing_id',new.id,'alert_id',a.id)
 from public.alerts a where a.enabled=true and a.universe=new.universe and a.user_id<>coalesce(new.owner_id,'00000000-0000-0000-0000-000000000000') limit 50;
 return new;
end; $$;
drop trigger if exists listing_alert_notify on public.listings;
create trigger listing_alert_notify after insert on public.listings for each row when (new.status='active') execute function public.notify_alert_owners();
