-- Progression events log
create table if not exists public.progression_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  exercise_id text references public.exercise_definitions(id) not null,
  event_type text not null check (event_type in ('band_up', 'band_down', 'dismissed')),
  from_band_id text references public.x3_band_profiles(id),
  to_band_id text references public.x3_band_profiles(id),
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_progression_events_user
  on public.progression_events(user_id);
create index if not exists idx_progression_events_exercise
  on public.progression_events(user_id, exercise_id);

alter table public.progression_events enable row level security;

create policy "Users can view own progression events"
  on public.progression_events for select using (auth.uid() = user_id);
create policy "Users can insert own progression events"
  on public.progression_events for insert with check (auth.uid() = user_id);
