-- Optional user-selected personalization. No biometric or inferred gender/age data.
create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  locale text not null default 'fr' check(locale in ('fr','ar','en')),
  country_code text not null default 'DZ',
  unit_system text not null default 'metric' check(unit_system in ('metric','imperial')),
  theme_preference text not null default 'auto' check(theme_preference in ('auto','light','dark','midnight','sunrise','sunny','cloudy','rainy','storm','snow')),
  weather_mode text not null default 'auto' check(weather_mode in ('auto','manual')),
  persona text not null default 'neutral' check(persona in ('neutral','feminine','masculine','child','teen','young-adult','adult','senior')),
  updated_at timestamptz not null default now()
);
alter table public.user_preferences enable row level security;
drop policy if exists "users manage own preferences" on public.user_preferences;
create policy "users manage own preferences" on public.user_preferences for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
