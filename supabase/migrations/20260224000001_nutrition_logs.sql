-- Daily nutrition logs
create table if not exists public.nutrition_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  calories integer,
  protein_g numeric(5,1),
  carbs_g numeric(5,1),
  fat_g numeric(5,1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, date)
);

create index if not exists idx_nutrition_logs_user_date
  on public.nutrition_logs(user_id, date);

alter table public.nutrition_logs enable row level security;

create policy "Users can view own nutrition logs"
  on public.nutrition_logs for select using (auth.uid() = user_id);

create policy "Users can insert own nutrition logs"
  on public.nutrition_logs for insert with check (auth.uid() = user_id);

create policy "Users can update own nutrition logs"
  on public.nutrition_logs for update using (auth.uid() = user_id);
