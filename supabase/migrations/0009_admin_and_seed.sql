-- WinsWi administration and moderation.
create policy "admins read all reports" on public.reports for select to authenticated using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "admins update reports" on public.reports for update to authenticated using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "admins read all listings" on public.listings for select to authenticated using (status='active' or owner_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "admins update listings" on public.listings for update to authenticated using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin')) with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
