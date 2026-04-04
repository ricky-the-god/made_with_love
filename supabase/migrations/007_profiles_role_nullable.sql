-- ============================================================
-- Made with Love — profiles.role can be cleared
-- The UI no longer presents a fixed profile role badge, and users can leave
-- a family space. When that happens, server actions clear role back to null.
-- ============================================================

alter table public.profiles
  alter column role drop not null;

comment on column public.profiles.role is 'Family-specific role within the current family. Null when the user is not in a family.';