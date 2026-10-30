-- Reader contributions: corrections, suggested moments and figures, stories, sources, ideas.
create table if not exists contributions (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  message text not null,
  page text,
  name text,
  email text,
  status text not null default 'new',   -- 'new' | 'reviewing' | 'added' | 'declined'
  created_at timestamptz not null default now()
);
create index if not exists contributions_status_idx on contributions (status, created_at desc);

-- Server-only: no public policies, so only the service role can read or write.
alter table contributions enable row level security;

-- Threads were removed from the site; drop their tables if they exist.
drop table if exists thread_steps;
drop table if exists threads;
