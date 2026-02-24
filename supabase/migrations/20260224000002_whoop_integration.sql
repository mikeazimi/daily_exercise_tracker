-- Whoop OAuth tokens
create table if not exists public.whoop_tokens (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  scopes text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Whoop daily data
create table if not exists public.whoop_data (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  recovery_score integer,
  strain numeric(4,1),
  hrv_ms numeric(5,1),
  resting_hr integer,
  sleep_hours numeric(4,2),
  calories_burned integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, date)
);

create index if not exists idx_whoop_tokens_user on public.whoop_tokens(user_id);
create index if not exists idx_whoop_data_user_date on public.whoop_data(user_id, date);

alter table public.whoop_tokens enable row level security;
alter table public.whoop_data enable row level security;

create policy "Users can view own whoop tokens"
  on public.whoop_tokens for select using (auth.uid() = user_id);
create policy "Users can insert own whoop tokens"
  on public.whoop_tokens for insert with check (auth.uid() = user_id);
create policy "Users can update own whoop tokens"
  on public.whoop_tokens for update using (auth.uid() = user_id);
create policy "Users can delete own whoop tokens"
  on public.whoop_tokens for delete using (auth.uid() = user_id);

create policy "Users can view own whoop data"
  on public.whoop_data for select using (auth.uid() = user_id);
create policy "Users can insert own whoop data"
  on public.whoop_data for insert with check (auth.uid() = user_id);
create policy "Users can update own whoop data"
  on public.whoop_data for update using (auth.uid() = user_id);
