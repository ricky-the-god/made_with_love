-- ============================================================
-- RESET: drop all existing app tables so 001 can recreate cleanly
-- ============================================================
drop table if exists public.family_invitations cascade;
drop table if exists public.ai_outputs         cascade;
drop table if exists public.memories           cascade;
drop table if exists public.recipes            cascade;
drop table if exists public.family_members     cascade;
drop table if exists public.families           cascade;
drop table if exists public.profiles           cascade;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user()  cascade;
drop function if exists public.handle_updated_at() cascade;

-- ============================================================
-- Enable UUID extension
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  full_name    text,
  avatar_url   text,
  family_id    uuid,
  role         text not null default 'owner' check (role in ('owner', 'editor', 'contributor', 'viewer')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ============================================================
-- FAMILIES
-- ============================================================
create table public.families (
  id              uuid primary key default uuid_generate_v4(),
  family_name     text not null,
  owner_id        uuid not null references public.profiles(id) on delete cascade,
  privacy_setting text not null default 'private' check (privacy_setting in ('private', 'public')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_family_id_fkey
  foreign key (family_id) references public.families(id) on delete set null
  not valid;

-- ============================================================
-- FAMILY MEMBERS
-- ============================================================
create table public.family_members (
  id                  uuid primary key default uuid_generate_v4(),
  family_id           uuid not null references public.families(id) on delete cascade,
  name                text not null,
  relation            text,
  generation          int,
  photo_url           text,
  bio                 text,
  country_of_origin   text,
  cultural_background text,
  birth_year          int,
  is_memorial         boolean not null default false,
  linked_user_id      uuid references public.profiles(id) on delete set null,
  parent_ids          uuid[] not null default '{}',
  created_by          uuid not null references public.profiles(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ============================================================
-- RECIPES
-- ============================================================
create table public.recipes (
  id                 uuid primary key default uuid_generate_v4(),
  family_id          uuid not null references public.families(id) on delete cascade,
  member_id          uuid references public.family_members(id) on delete set null,
  created_by         uuid not null references public.profiles(id),
  title              text not null,
  description        text,
  ingredients        text,
  steps              text,
  notes              text,
  prep_time          text,
  cook_time          text,
  servings           text,
  country_of_origin  text,
  culture_tag        text,
  occasion           text,
  language           text default 'en',
  image_url          text,
  is_favorite        boolean not null default false,
  is_family_favorite boolean not null default false,
  visibility         text not null default 'private' check (visibility in ('private', 'family', 'public')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ============================================================
-- MEMORIES
-- ============================================================
create table public.memories (
  id              uuid primary key default uuid_generate_v4(),
  recipe_id       uuid not null references public.recipes(id) on delete cascade,
  created_by      uuid not null references public.profiles(id),
  text            text,
  voice_note_url  text,
  photo_url       text,
  occasion        text,
  meaning_note    text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- AI OUTPUTS
-- ============================================================
create table public.ai_outputs (
  id                  uuid primary key default uuid_generate_v4(),
  recipe_id           uuid not null references public.recipes(id) on delete cascade,
  source_image_url    text,
  extracted_text      text,
  structured_recipe   jsonb,
  guided_steps        jsonb,
  translation_output  jsonb,
  confidence_note     text,
  model_used          text,
  created_at          timestamptz not null default now()
);

-- ============================================================
-- FAMILY INVITATIONS
-- ============================================================
create table public.family_invitations (
  id          uuid primary key default uuid_generate_v4(),
  family_id   uuid not null references public.families(id) on delete cascade,
  invited_by  uuid not null references public.profiles(id),
  email       text not null,
  role        text not null default 'contributor' check (role in ('editor', 'contributor', 'viewer')),
  token       uuid not null default uuid_generate_v4() unique,
  accepted_at timestamptz,
  expires_at  timestamptz not null default (now() + interval '7 days'),
  created_at  timestamptz not null default now()
);

-- ============================================================
-- TRIGGERS
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at    before update on public.profiles        for each row execute function public.handle_updated_at();
create trigger families_updated_at    before update on public.families        for each row execute function public.handle_updated_at();
create trigger members_updated_at     before update on public.family_members  for each row execute function public.handle_updated_at();
create trigger recipes_updated_at     before update on public.recipes         for each row execute function public.handle_updated_at();
create trigger memories_updated_at    before update on public.memories        for each row execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_profiles_family_id       on public.profiles(family_id);
create index idx_family_members_family_id on public.family_members(family_id);
create index idx_recipes_family_id        on public.recipes(family_id);
create index idx_recipes_member_id        on public.recipes(member_id);
create index idx_recipes_is_favorite      on public.recipes(is_favorite) where is_favorite = true;
create index idx_recipes_visibility       on public.recipes(visibility);
create index idx_memories_recipe_id       on public.memories(recipe_id);
create index idx_ai_outputs_recipe_id     on public.ai_outputs(recipe_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles           enable row level security;
alter table public.families           enable row level security;
alter table public.family_members     enable row level security;
alter table public.recipes            enable row level security;
alter table public.memories           enable row level security;
alter table public.ai_outputs         enable row level security;
alter table public.family_invitations enable row level security;

create policy "profiles: read own"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles for update using (auth.uid() = id);

create policy "families: read if member" on public.families
  for select using (id in (select family_id from public.profiles where id = auth.uid()));
create policy "families: insert own"     on public.families
  for insert with check (owner_id = auth.uid());
create policy "families: update if owner" on public.families
  for update using (owner_id = auth.uid());
create policy "families: delete if owner" on public.families
  for delete using (owner_id = auth.uid());
create policy "families: read public"    on public.families
  for select using (privacy_setting = 'public');

create policy "family_members: read if same family" on public.family_members
  for select using (
    family_id in (select family_id from public.profiles where id = auth.uid())
    or family_id in (select id from public.families where privacy_setting = 'public')
  );
create policy "family_members: insert if member" on public.family_members
  for insert with check (
    family_id in (select family_id from public.profiles where id = auth.uid())
    and created_by = auth.uid()
  );
create policy "family_members: update if creator or owner" on public.family_members
  for update using (
    created_by = auth.uid()
    or family_id in (select id from public.families where owner_id = auth.uid())
  );
create policy "family_members: delete if creator or owner" on public.family_members
  for delete using (
    created_by = auth.uid()
    or family_id in (select id from public.families where owner_id = auth.uid())
  );

create policy "recipes: read own family" on public.recipes
  for select using (
    family_id in (select family_id from public.profiles where id = auth.uid())
    or visibility = 'public'
  );
create policy "recipes: insert if family member" on public.recipes
  for insert with check (
    family_id in (select family_id from public.profiles where id = auth.uid())
    and created_by = auth.uid()
  );
create policy "recipes: update if creator or owner" on public.recipes
  for update using (
    created_by = auth.uid()
    or family_id in (select id from public.families where owner_id = auth.uid())
  );
create policy "recipes: delete if creator or owner" on public.recipes
  for delete using (
    created_by = auth.uid()
    or family_id in (select id from public.families where owner_id = auth.uid())
  );

create policy "memories: read if same family as recipe" on public.memories
  for select using (
    recipe_id in (
      select id from public.recipes
      where family_id in (select family_id from public.profiles where id = auth.uid())
         or visibility = 'public'
    )
  );
create policy "memories: insert if recipe in family" on public.memories
  for insert with check (
    recipe_id in (
      select id from public.recipes
      where family_id in (select family_id from public.profiles where id = auth.uid())
    )
    and created_by = auth.uid()
  );
create policy "memories: update own" on public.memories for update using (created_by = auth.uid());
create policy "memories: delete own" on public.memories for delete using (created_by = auth.uid());

create policy "ai_outputs: read if same family as recipe" on public.ai_outputs
  for select using (
    recipe_id in (
      select id from public.recipes
      where family_id in (select family_id from public.profiles where id = auth.uid())
    )
  );
create policy "ai_outputs: insert if recipe in family" on public.ai_outputs
  for insert with check (
    recipe_id in (
      select id from public.recipes
      where family_id in (select family_id from public.profiles where id = auth.uid())
    )
  );

create policy "invitations: read own family" on public.family_invitations
  for select using (
    family_id in (select id from public.families where owner_id = auth.uid())
    or email = (select email from public.profiles where id = auth.uid())
  );
create policy "invitations: insert if owner" on public.family_invitations
  for insert with check (
    family_id in (select id from public.families where owner_id = auth.uid())
    and invited_by = auth.uid()
  );
create policy "invitations: delete if owner" on public.family_invitations
  for delete using (
    family_id in (select id from public.families where owner_id = auth.uid())
  );

-- ============================================================
-- BACKFILL: create profile for any existing auth users
-- ============================================================
insert into public.profiles (id, email, role)
select u.id, u.email, 'owner'
from auth.users u
where u.id not in (select p.id from public.profiles p)
on conflict (id) do nothing;
