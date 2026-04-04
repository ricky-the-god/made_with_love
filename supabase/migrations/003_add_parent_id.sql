-- Add parent_id to family_members for explicit parent-child tree relationships.
-- Run this in the Supabase SQL editor if it hasn't been applied yet.
alter table public.family_members
  add column if not exists parent_id uuid
    references public.family_members(id)
    on delete set null;

create index if not exists idx_family_members_parent_id
  on public.family_members(parent_id)
  where parent_id is not null;
