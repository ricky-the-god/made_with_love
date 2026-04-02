-- Active: 1775092512087@@postgres.uensufrhpnoloyfycuyd@null
-- =============================================================================
-- Initial schema: profiles, families, family_members, recipes, memories, ai_outputs
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Profiles (extends auth.users — one row per authenticated user)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  user_id       uuid        primary key references auth.users (id) on delete cascade,
  name          text,
  email         text        not null,
  profile_photo text,
  role          text        not null default 'member'
                              check (role in ('administrator', 'admin', 'member')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Families
-- ---------------------------------------------------------------------------
create table if not exists public.families (
  family_id       bigint      generated always as identity primary key,
  family_name     text        not null,
  owner_user_id   uuid        not null references public.profiles (user_id) on delete cascade,
  privacy_setting text        not null default 'family_only'
                                check (privacy_setting in ('public', 'family_only', 'private')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Index every FK column (Postgres does NOT auto-index FKs)
create index families_owner_user_id_idx on public.families (owner_user_id);

-- ---------------------------------------------------------------------------
-- Family Members
-- ---------------------------------------------------------------------------
create table if not exists public.family_members (
  member_id    bigint      generated always as identity primary key,
  family_id    bigint      not null references public.families (family_id) on delete cascade,
  name         text        not null,
  relation     text,
  generation   int,
  photo        text,
  bio          text,
  is_memorial  boolean     not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index family_members_family_id_idx on public.family_members (family_id);

-- ---------------------------------------------------------------------------
-- Recipes
-- ingredients / steps stored as jsonb for flexible structure
-- prep_time / cook_time in minutes
-- ---------------------------------------------------------------------------
create table if not exists public.recipes (
  recipe_id         bigint      generated always as identity primary key,
  family_id         bigint      not null references public.families (family_id) on delete cascade,
  member_id         bigint      references public.family_members (member_id) on delete set null,
  created_by        uuid        references public.profiles (user_id) on delete set null,
  title             text        not null,
  ingredients       jsonb,
  steps             jsonb,
  notes             text,
  servings          int,
  prep_time         int,
  cook_time         int,
  language          text,
  culture_tag       text,
  country_of_origin text,
  is_favorite       boolean     not null default false,
  visibility        text        not null default 'family_only'
                                  check (visibility in ('public', 'family_only', 'private')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index recipes_family_id_idx   on public.recipes (family_id);
create index recipes_member_id_idx   on public.recipes (member_id);
create index recipes_created_by_idx  on public.recipes (created_by);
create index recipes_visibility_idx  on public.recipes (visibility);

-- ---------------------------------------------------------------------------
-- Memories
-- ---------------------------------------------------------------------------
create table if not exists public.memories (
  memory_id      bigint      generated always as identity primary key,
  recipe_id      bigint      not null references public.recipes (recipe_id) on delete cascade,
  text           text,
  voice_note_url text,
  photo_url      text,
  occasion       text,
  meaning_note   text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index memories_recipe_id_idx on public.memories (recipe_id);

-- ---------------------------------------------------------------------------
-- AI Outputs
-- structured_recipe / guided_steps / translation_output stored as jsonb
-- ---------------------------------------------------------------------------
create table if not exists public.ai_outputs (
  ai_output_id       bigint      generated always as identity primary key,
  recipe_id          bigint      not null references public.recipes (recipe_id) on delete cascade,
  extracted_text     text,
  structured_recipe  jsonb,
  guided_steps       jsonb,
  translation_output jsonb,
  confidence_note    text,
  created_at         timestamptz not null default now()
);

create index ai_outputs_recipe_id_idx on public.ai_outputs (recipe_id);

-- =============================================================================
-- Trigger: auto-create profile when a user signs up via Supabase Auth
-- =============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, email, name, profile_photo)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================================================
-- Row Level Security
-- =============================================================================

-- Helper: returns true if the current user owns (or is the owner of) a family.
-- Wrapped in security definer so it can be used in policies without recursion.
create or replace function public.is_family_owner(p_family_id bigint)
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
  );
$$;

-- --- profiles ---
alter table public.profiles enable row level security;

create policy "profiles: read own"
  on public.profiles for select
  using ((select auth.uid()) = user_id);

create policy "profiles: update own"
  on public.profiles for update
  using ((select auth.uid()) = user_id);

-- --- families ---
alter table public.families enable row level security;

create policy "families: owner full access"
  on public.families for all
  using ((select auth.uid()) = owner_user_id);

create policy "families: public families readable by anyone"
  on public.families for select
  using (privacy_setting = 'public');

-- --- family_members ---
alter table public.family_members enable row level security;

create policy "family_members: owner can manage"
  on public.family_members for all
  using ((select public.is_family_owner(family_id)));

create policy "family_members: readable when family is public"
  on public.family_members for select
  using (
    exists (
      select 1 from public.families f
      where f.family_id = family_members.family_id
        and f.privacy_setting = 'public'
    )
  );

-- --- recipes ---
alter table public.recipes enable row level security;

create policy "recipes: public recipes visible to all"
  on public.recipes for select
  using (visibility = 'public');

create policy "recipes: family_only visible to family owner"
  on public.recipes for select
  using (
    visibility = 'family_only'
    and (select public.is_family_owner(family_id))
  );

create policy "recipes: creator can manage own recipes"
  on public.recipes for all
  using ((select auth.uid()) = created_by);

-- --- memories ---
alter table public.memories enable row level security;

create policy "memories: accessible when recipe is accessible"
  on public.memories for select
  using (
    exists (
      select 1 from public.recipes r
      where r.recipe_id = memories.recipe_id
        and (
          r.visibility = 'public'
          or r.created_by = (select auth.uid())
          or (r.visibility = 'family_only' and (select public.is_family_owner(r.family_id)))
        )
    )
  );

create policy "memories: family owner can manage"
  on public.memories for all
  using (
    exists (
      select 1 from public.recipes r
      where r.recipe_id = memories.recipe_id
        and (select public.is_family_owner(r.family_id))
    )
  );

-- --- ai_outputs ---
alter table public.ai_outputs enable row level security;

create policy "ai_outputs: accessible when recipe is accessible"
  on public.ai_outputs for select
  using (
    exists (
      select 1 from public.recipes r
      where r.recipe_id = ai_outputs.recipe_id
        and (
          r.visibility = 'public'
          or r.created_by = (select auth.uid())
          or (r.visibility = 'family_only' and (select public.is_family_owner(r.family_id)))
        )
    )
  );

create policy "ai_outputs: family owner can manage"
  on public.ai_outputs for all
  using (
    exists (
      select 1 from public.recipes r
      where r.recipe_id = ai_outputs.recipe_id
        and (select public.is_family_owner(r.family_id))
    )
  );
