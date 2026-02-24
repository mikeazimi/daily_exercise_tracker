-- Workout Notes
alter table public.workout_sessions add column if not exists notes text default null;

-- Water Intake
alter table public.nutrition_logs add column if not exists water_intake_oz integer default null;

-- User Settings
create table if not exists public.user_settings (
  user_id uuid references auth.users(id) on delete cascade primary key,
  rest_timer_seconds integer not null default 90,
  deload_frequency_weeks integer not null default 4,
  deload_enabled boolean not null default true,
  weekly_workout_target integer not null default 3,
  water_target_oz integer default null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "Users can view own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);

-- Personal Records
create table if not exists public.personal_records (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  exercise_id text not null,
  record_type text not null check (record_type in ('max_reps', 'max_force')),
  band_id text,
  value numeric not null,
  achieved_at timestamptz not null default now(),
  session_id uuid references public.workout_sessions(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_personal_records_user_exercise
  on public.personal_records(user_id, exercise_id, record_type);

alter table public.personal_records enable row level security;

create policy "Users can view own records"
  on public.personal_records for select
  using (auth.uid() = user_id);

create policy "Users can insert own records"
  on public.personal_records for insert
  with check (auth.uid() = user_id);

-- Progress Photos
create table if not exists public.progress_photos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  measurement_id uuid references public.body_measurements(id),
  photo_url text not null,
  photo_type text not null check (photo_type in ('front', 'side', 'back')) default 'front',
  taken_at date not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_progress_photos_user
  on public.progress_photos(user_id, taken_at desc);

alter table public.progress_photos enable row level security;

create policy "Users can view own photos"
  on public.progress_photos for select
  using (auth.uid() = user_id);

create policy "Users can insert own photos"
  on public.progress_photos for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own photos"
  on public.progress_photos for delete
  using (auth.uid() = user_id);
