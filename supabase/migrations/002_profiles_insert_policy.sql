-- Backfill: create missing profile rows for any auth users who signed up
-- before the handle_new_user trigger was active.
-- Run this once in the Supabase SQL editor.
insert into public.profiles (id, email, role)
select u.id, u.email, 'owner'
from auth.users u
where u.id not in (select p.id from public.profiles p)
on conflict (id) do nothing;
