-- Replace single parent_id with parent_ids uuid[] to support multiple parents.
-- Run this in the Supabase SQL editor.

-- Migrate existing data: copy any non-null parent_id into the new array column
alter table public.family_members
  add column if not exists parent_ids uuid[] not null default '{}';

-- Copy existing parent_id values into the array (safe no-op if all are null)
update public.family_members
  set parent_ids = array[parent_id]
  where parent_id is not null;

-- Drop the old single-parent column and its index
drop index if exists idx_family_members_parent_id;
alter table public.family_members drop column if exists parent_id;

-- Index for fast lookups (e.g. "who are the children of member X?")
create index if not exists idx_family_members_parent_ids
  on public.family_members using gin(parent_ids)
  where array_length(parent_ids, 1) > 0;
