-- Per-user likes on public family trees
create table if not exists public.family_likes (
  id         uuid primary key default uuid_generate_v4(),
  family_id  uuid not null references public.families(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (family_id, user_id)
);

alter table public.family_likes enable row level security;

-- Anyone can read like counts
create policy "anyone can view likes"
  on public.family_likes for select
  using (true);

-- Authenticated users can like
create policy "users can like"
  on public.family_likes for insert
  with check (user_id = auth.uid());

-- Users can unlike their own like
create policy "users can unlike"
  on public.family_likes for delete
  using (user_id = auth.uid());
