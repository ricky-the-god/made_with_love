-- Allow users to follow/connect with public families.
-- Run this in the Supabase SQL editor.

create table public.family_connections (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  family_id  uuid not null references public.families(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, family_id)
);

alter table public.family_connections enable row level security;

create policy "connections: manage own"
  on public.family_connections for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create index idx_family_connections_user_id on public.family_connections(user_id);
