-- Body composition measurements
create table if not exists public.body_measurements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  weight_lbs numeric(5,1),
  body_fat_pct numeric(4,1),
  created_at timestamptz not null default now(),
  unique(user_id, date)
);

create index if not exists idx_body_measurements_user_date
  on public.body_measurements(user_id, date);

alter table public.body_measurements enable row level security;

create policy "Users can view own body measurements"
  on public.body_measurements for select using (auth.uid() = user_id);

create policy "Users can insert own body measurements"
  on public.body_measurements for insert with check (auth.uid() = user_id);

create policy "Users can update own body measurements"
  on public.body_measurements for update using (auth.uid() = user_id);
