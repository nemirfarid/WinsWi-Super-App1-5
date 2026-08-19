-- WinsWi v8: private listing media readable through authenticated/anonymous signed URLs only for active listings.
create index if not exists listing_images_path_idx on public.listing_images(storage_path);

drop policy if exists "authenticated can read active listing media" on storage.objects;
create policy "authenticated can read active listing media" on storage.objects
for select to authenticated
using (
  bucket_id = 'listing-media'
  and exists (
    select 1 from public.listing_images li
    join public.listings l on l.id = li.listing_id
    where li.storage_path = name and l.status = 'active'
  )
);

drop policy if exists "anon can read active listing media" on storage.objects;
create policy "anon can read active listing media" on storage.objects
for select to anon
using (
  bucket_id = 'listing-media'
  and exists (
    select 1 from public.listing_images li
    join public.listings l on l.id = li.listing_id
    where li.storage_path = name and l.status = 'active'
  )
);
