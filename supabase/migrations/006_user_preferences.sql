-- ============================================================
-- Made with Love — User preferences on profiles
-- Adds privacy and notification preference columns. All columns
-- have safe defaults so existing rows are unaffected.
-- ============================================================

-- Privacy preferences
alter table public.profiles
  add column if not exists pref_recipes_private_by_default boolean not null default true,
  add column if not exists pref_show_in_discover           boolean not null default false,
  add column if not exists pref_show_memorial_public        boolean not null default false;

-- Notification preferences
alter table public.profiles
  add column if not exists pref_notify_invitations  boolean not null default true,
  add column if not exists pref_notify_new_recipe   boolean not null default true,
  add column if not exists pref_notify_new_memory   boolean not null default false;

comment on column public.profiles.pref_recipes_private_by_default is 'New recipes are private by default when true';
comment on column public.profiles.pref_show_in_discover            is 'Allow public recipes to appear in cultural discovery';
comment on column public.profiles.pref_show_memorial_public        is 'Allow memorial profiles to be visible publicly';
comment on column public.profiles.pref_notify_invitations          is 'Email on family invitation events';
comment on column public.profiles.pref_notify_new_recipe           is 'Email when a family member adds a recipe';
comment on column public.profiles.pref_notify_new_memory           is 'Email when a memory is added to a recipe';
