-- Add onboarding + feature toggle columns to user_settings
alter table public.user_settings
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists enable_nutrition boolean not null default true,
  add column if not exists enable_water boolean not null default true,
  add column if not exists enable_progress_photos boolean not null default true,
  add column if not exists enable_body_measurements boolean not null default true,
  add column if not exists enable_whoop boolean not null default true,
  add column if not exists enable_deload boolean not null default true;
