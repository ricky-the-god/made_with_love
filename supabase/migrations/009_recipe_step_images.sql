-- Add optional per-step image URLs (one URL per line, aligned to steps order)
alter table public.recipes
add column if not exists step_images text;

comment on column public.recipes.step_images is 'Optional newline-delimited image URLs aligned with recipe steps order.';
