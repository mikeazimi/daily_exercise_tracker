-- Exercise definitions (static reference data)
create table if not exists public.exercise_definitions (
  id text primary key,
  name text not null,
  description text not null,
  workout_type text not null check (workout_type in ('A', 'B')),
  phase integer not null,
  phase_name text not null,
  phase_time_range text not null,
  order_index integer not null,
  default_reps text not null,
  is_x3 boolean not null default false,
  is_timed boolean not null default false
);

-- X3 band profiles (static reference data)
create table if not exists public.x3_band_profiles (
  id text primary key,
  name text not null,
  color text not null,
  color_hex text not null,
  min_resistance_lbs integer not null,
  max_resistance_lbs integer not null
);

-- Workout sessions
create table if not exists public.workout_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  workout_type text not null check (workout_type in ('A', 'B')),
  date date not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, date)
);

-- Exercise logs
create table if not exists public.exercise_logs (
  id uuid default gen_random_uuid() primary key,
  session_id uuid references public.workout_sessions(id) on delete cascade not null,
  exercise_id text references public.exercise_definitions(id) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  completed boolean not null default false,
  completed_at timestamptz,
  notes text,
  -- X3-specific fields (null for non-X3 exercises)
  band_id text references public.x3_band_profiles(id),
  full_reps integer,
  partial_reps integer,
  estimated_force_lbs integer,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_workout_sessions_user_date on public.workout_sessions(user_id, date);
create index if not exists idx_exercise_logs_session on public.exercise_logs(session_id);
create index if not exists idx_exercise_logs_user on public.exercise_logs(user_id);

-- Row Level Security
alter table public.workout_sessions enable row level security;
alter table public.exercise_logs enable row level security;
alter table public.exercise_definitions enable row level security;
alter table public.x3_band_profiles enable row level security;

-- Everyone can read reference data
create policy "Anyone can read exercise definitions"
  on public.exercise_definitions for select using (true);

create policy "Anyone can read band profiles"
  on public.x3_band_profiles for select using (true);

-- Users can only access their own workout data
create policy "Users can view own sessions"
  on public.workout_sessions for select using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.workout_sessions for insert with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on public.workout_sessions for update using (auth.uid() = user_id);

create policy "Users can view own exercise logs"
  on public.exercise_logs for select using (auth.uid() = user_id);

create policy "Users can insert own exercise logs"
  on public.exercise_logs for insert with check (auth.uid() = user_id);

create policy "Users can update own exercise logs"
  on public.exercise_logs for update using (auth.uid() = user_id);
