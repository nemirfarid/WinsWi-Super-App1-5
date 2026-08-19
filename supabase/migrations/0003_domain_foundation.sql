-- WinsWi domain foundation: explicit universe metadata, matching indexes and safer timestamps.
create index if not exists listings_universe_created_idx on public.listings(universe, created_at desc);
create index if not exists listings_price_idx on public.listings(price) where status='active';
create index if not exists buyer_requests_universe_status_idx on public.buyer_requests(universe, status, created_at desc);

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at before update on public.listings for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at before update on public.conversations for each row execute function public.set_updated_at();

drop trigger if exists ai_conversations_set_updated_at on public.ai_conversations;
create trigger ai_conversations_set_updated_at before update on public.ai_conversations for each row execute function public.set_updated_at();

-- Public discovery view: never exposes owner_id or private metadata to anonymous discovery.
create or replace view public.public_listings as
select id, universe, title, description, location, wilaya, commune, price, currency, verified, created_at, updated_at
from public.listings where status='active';

grant select on public.public_listings to anon, authenticated;
