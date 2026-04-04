-- Add per-user recipe ratings (1–5 stars)
create table if not exists public.recipe_ratings (
  id          uuid primary key default uuid_generate_v4(),
  recipe_id   uuid not null references public.recipes(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  rating      int  not null check (rating >= 1 and rating <= 5),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (recipe_id, user_id)
);

comment on table public.recipe_ratings is 'Per-user star ratings (1–5) for recipes.';

-- RLS
alter table public.recipe_ratings enable row level security;

-- Family members can view ratings on their family's recipes;
-- anyone can view ratings on public recipes
create policy "family members can view ratings"
  on public.recipe_ratings for select
  using (
    exists (
      select 1 from public.recipes r
      where r.id = recipe_ratings.recipe_id
        and (
          r.visibility = 'public'
          or exists (
            select 1 from public.profiles p
            where p.family_id = r.family_id
              and p.id = auth.uid()
          )
        )
    )
  );

-- Any authenticated user can rate a public recipe;
-- family members can rate their own family's recipes
create policy "users can rate recipes"
  on public.recipe_ratings for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.recipes r
      where r.id = recipe_id
        and (
          r.visibility = 'public'
          or exists (
            select 1 from public.profiles p
            where p.family_id = r.family_id
              and p.id = auth.uid()
          )
        )
    )
  );

create policy "users can update own rating"
  on public.recipe_ratings for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "users can delete own rating"
  on public.recipe_ratings for delete
  using (user_id = auth.uid());
