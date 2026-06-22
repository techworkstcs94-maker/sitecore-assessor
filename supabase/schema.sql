-- Candidates
create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  years_experience int not null,
  level text not null,
  session_token text unique,
  session_started_at timestamptz,
  session_ended_at timestamptz,
  total_score int default 0,
  max_score int default 0,
  created_at timestamptz default now()
);

-- Submissions per challenge
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidates(id) on delete cascade,
  challenge_id text not null,
  code text not null,
  score int default 0,
  max_score int default 0,
  passed_tests int default 0,
  total_tests int default 0,
  submitted_at timestamptz default now(),
  attempt_number int default 1
);

-- Anti-cheat events
create table if not exists cheat_events (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidates(id) on delete cascade,
  event_type text not null,
  detail text,
  severity text not null,
  occurred_at timestamptz default now()
);

-- Row Level Security
alter table candidates enable row level security;
alter table submissions enable row level security;
alter table cheat_events enable row level security;

-- Service role can do everything (used by server-side API routes)
create policy "service_all_candidates" on candidates
  for all using (auth.role() = 'service_role');

create policy "service_all_submissions" on submissions
  for all using (auth.role() = 'service_role');

create policy "service_all_cheat_events" on cheat_events
  for all using (auth.role() = 'service_role');
