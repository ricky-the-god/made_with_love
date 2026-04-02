-- =============================================================================
-- Migration 2: family memberships, storage buckets, updated_at trigger,
--              rename memories.text → memories.content
-- =============================================================================

-- ---------------------------------------------------------------------------
-- updated_at auto-trigger (applied to all tables that have the column)
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger set_families_updated_at
  before update on public.families
  for each row execute procedure public.set_updated_at();

create trigger set_family_members_updated_at
  before update on public.family_members
  for each row execute procedure public.set_updated_at();

create trigger set_recipes_updated_at
  before update on public.recipes
  for each row execute procedure public.set_updated_at();

create trigger set_memories_updated_at
  before update on public.memories
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Rename memories.text → memories.content (avoids keyword shadowing)
-- ---------------------------------------------------------------------------
alter table public.memories rename column "text" to content;

-- ---------------------------------------------------------------------------
-- Family Memberships (invite other users into a family)
-- ---------------------------------------------------------------------------
create table if not exists public.family_memberships (
  membership_id bigint      generated always as identity primary key,
  family_id     bigint      not null references public.families (family_id) on delete cascade,
  user_id       uuid        not null references public.profiles (user_id) on delete cascade,
  role          text        not null default 'member'
                              check (role in ('admin', 'member', 'viewer')),
  invited_by    uuid        references public.profiles (user_id) on delete set null,
  status        text        not null default 'pending'
                              check (status in ('pending', 'accepted', 'declined')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (family_id, user_id)   -- one membership per user per family
);

create index family_memberships_family_id_idx on public.family_memberships (family_id);
create index family_memberships_user_id_idx   on public.family_memberships (user_id);
create index family_memberships_status_idx    on public.family_memberships (family_id, status);

create trigger set_family_memberships_updated_at
  before update on public.family_memberships
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Update helper: is_family_member checks membership OR ownership
-- (replaces the owner-only helper from migration 1)
-- ---------------------------------------------------------------------------
create or replace function public.is_family_member(p_family_id bigint)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.families
    where family_id = p_family_id
      and owner_user_id = (select auth.uid())
  )
  or exists (
    select 1 from public.family_memberships
    where family_id = p_family_id
      and user_id = (select auth.uid())
      and status = 'accepted'
  );
$$;

-- ---------------------------------------------------------------------------
-- RLS for family_memberships
-- ---------------------------------------------------------------------------
alter table public.family_memberships enable row level security;

-- Members can see their own membership row (including pending invites)
create policy "memberships: user can see own"
  on public.family_memberships for select
  using ((select auth.uid()) = user_id);

-- Family owner can see and manage all memberships for their family
create policy "memberships: owner can manage"
  on public.family_memberships for all
  using ((select public.is_family_owner(family_id)));

-- User can accept or decline their own invite (update own row)
create policy "memberships: user can update own status"
  on public.family_memberships for update
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- Widen existing RLS policies to allow accepted members (not just owners)
-- ---------------------------------------------------------------------------

-- family_members: accepted members can read
drop policy if exists "family_members: readable when family is public" on public.family_members;

create policy "family_members: readable by family members"
  on public.family_members for select
  using (
    (select public.is_family_member(family_id))
    or exists (
      select 1 from public.families f
      where f.family_id = family_members.family_id
        and f.privacy_setting = 'public'
    )
  );

-- recipes: accepted members can read family_only recipes
drop policy if exists "recipes: family_only visible to family owner" on public.recipes;

create policy "recipes: family_only visible to members"
  on public.recipes for select
  using (
    visibility = 'family_only'
    and (select public.is_family_member(family_id))
  );

-- memories: accessible to members of the recipe's family
drop policy if exists "memories: accessible when recipe is accessible" on public.memories;

create policy "memories: accessible when recipe is accessible"
  on public.memories for select
  using (
    exists (
      select 1 from public.recipes r
      where r.recipe_id = memories.recipe_id
        and (
          r.visibility = 'public'
          or r.created_by = (select auth.uid())
          or (r.visibility = 'family_only' and (select public.is_family_member(r.family_id)))
        )
    )
  );

-- ai_outputs: same as memories
drop policy if exists "ai_outputs: accessible when recipe is accessible" on public.ai_outputs;

create policy "ai_outputs: accessible when recipe is accessible"
  on public.ai_outputs for select
  using (
    exists (
      select 1 from public.recipes r
      where r.recipe_id = ai_outputs.recipe_id
        and (
          r.visibility = 'public'
          or r.created_by = (select auth.uid())
          or (r.visibility = 'family_only' and (select public.is_family_member(r.family_id)))
        )
    )
  );

-- ---------------------------------------------------------------------------
-- Storage buckets
-- ---------------------------------------------------------------------------

-- Profile photos (public read, authenticated write)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-photos',
  'profile-photos',
  true,
  5242880,   -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Family member photos (private — served via signed URLs)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'family-photos',
  'family-photos',
  false,
  10485760,  -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Recipe photos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'recipe-photos',
  'recipe-photos',
  false,
  10485760,  -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Voice notes (memories)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'voice-notes',
  'voice-notes',
  false,
  52428800,  -- 50 MB
  array['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/webm', 'audio/wav']
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Storage RLS policies
-- File paths follow the convention:  {bucket}/{family_id}/{user_id}/{filename}
-- This lets policies check ownership via the path without a DB join.
-- ---------------------------------------------------------------------------

-- profile-photos: anyone can read; authenticated users upload to their own folder
create policy "profile-photos: public read"
  on storage.objects for select
  using (bucket_id = 'profile-photos');

create policy "profile-photos: owner upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'profile-photos'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "profile-photos: owner delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'profile-photos'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

-- family-photos: family members only
create policy "family-photos: member read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'family-photos'
    and (select public.is_family_member((storage.foldername(name))[1]::bigint))
  );

create policy "family-photos: member upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'family-photos'
    and (select public.is_family_member((storage.foldername(name))[1]::bigint))
  );

create policy "family-photos: owner delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'family-photos'
    and (select public.is_family_owner((storage.foldername(name))[1]::bigint))
  );

-- recipe-photos: same as family-photos
create policy "recipe-photos: member read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'recipe-photos'
    and (select public.is_family_member((storage.foldername(name))[1]::bigint))
  );

create policy "recipe-photos: member upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'recipe-photos'
    and (select public.is_family_member((storage.foldername(name))[1]::bigint))
  );

create policy "recipe-photos: owner delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'recipe-photos'
    and (select public.is_family_owner((storage.foldername(name))[1]::bigint))
  );

-- voice-notes: same as family-photos
create policy "voice-notes: member read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'voice-notes'
    and (select public.is_family_member((storage.foldername(name))[1]::bigint))
  );

create policy "voice-notes: member upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'voice-notes'
    and (select public.is_family_member((storage.foldername(name))[1]::bigint))
  );

create policy "voice-notes: owner delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'voice-notes'
    and (select public.is_family_owner((storage.foldername(name))[1]::bigint))
  );
