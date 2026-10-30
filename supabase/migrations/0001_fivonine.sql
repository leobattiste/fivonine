-- Fivonine — historical knowledge graph organized around periods (eras and decades).
-- Every record is created once and connected by join tables, never duplicated.

create type dimension as enum ('inside', 'abroad', 'foreign');
create type evidence_status as enum ('documented', 'interpretation', 'disputed', 'investigative');
create type date_precision as enum ('day', 'month', 'year', 'circa');
create type period_kind as enum ('era', 'decade');

create table categories (
  slug text primary key,
  name text not null,
  short text not null,
  sort int not null default 0
);

create table periods (
  slug text primary key,
  kind period_kind not null,
  label text not null,
  start_year int not null,
  end_year int not null,
  title text not null,
  overview text,
  legacy text,
  research_note text
);

create table people (
  slug text primary key,
  name text not null,
  born text,
  died text,
  roles text[] not null default '{}',
  bio text not null default ''
);

create table events (
  slug text primary key,
  title text not null,
  date_text text not null,              -- '1825-04-17', '1944-05', '1928'
  year int generated always as (substring(date_text from 1 for 4)::int) stored,
  precision date_precision not null default 'day',
  dimension dimension not null,
  location text not null default '',
  countries text[] not null default '{}',
  summary text not null,
  context text,
  causes text,
  consequences text,
  status evidence_status not null default 'documented',
  published boolean not null default true,
  search tsvector generated always as (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(location, '')), 'C')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index events_year_idx on events (year);
create index events_search_idx on events using gin (search);
create index events_countries_idx on events using gin (countries);

create table event_categories (
  event_slug text references events(slug) on delete cascade,
  category_slug text references categories(slug) on delete cascade,
  primary key (event_slug, category_slug)
);

create table event_people (
  event_slug text references events(slug) on delete cascade,
  person_slug text references people(slug) on delete cascade,
  primary key (event_slug, person_slug)
);

-- Graph edges between events ("led to", "context for", "echoes").
create table event_links (
  from_slug text references events(slug) on delete cascade,
  to_slug text references events(slug) on delete cascade,
  relation text not null default 'related',
  primary key (from_slug, to_slug)
);

create table sources (
  id bigserial primary key,
  event_slug text references events(slug) on delete cascade,
  title text not null,
  url text,
  sort int not null default 0
);

create table threads (
  slug text primary key,
  title text not null,
  dek text not null,
  caveat text not null
);

create table thread_steps (
  thread_slug text references threads(slug) on delete cascade,
  position int not null,
  event_slug text references events(slug) on delete cascade,
  note text not null,
  primary key (thread_slug, position)
);

-- Engagement: newsletter subscribers and anonymous view counts.
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  token uuid not null default gen_random_uuid(),
  status text not null default 'active',   -- 'active' | 'unsubscribed'
  source text,
  created_at timestamptz not null default now()
);

create table event_views (
  event_slug text primary key references events(slug) on delete cascade,
  views bigint not null default 0
);

create or replace function increment_view(slug_in text)
returns void language sql security definer as $$
  insert into event_views (event_slug, views) values (slug_in, 1)
  on conflict (event_slug) do update set views = event_views.views + 1;
$$;

-- Row level security: content is public-read; subscribers are server-only.
alter table categories enable row level security;
alter table periods enable row level security;
alter table people enable row level security;
alter table events enable row level security;
alter table event_categories enable row level security;
alter table event_people enable row level security;
alter table event_links enable row level security;
alter table sources enable row level security;
alter table threads enable row level security;
alter table thread_steps enable row level security;
alter table subscribers enable row level security;
alter table event_views enable row level security;

create policy "public read" on categories for select using (true);
create policy "public read" on periods for select using (true);
create policy "public read" on people for select using (true);
create policy "public read" on events for select using (published);
create policy "public read" on event_categories for select using (true);
create policy "public read" on event_people for select using (true);
create policy "public read" on event_links for select using (true);
create policy "public read" on sources for select using (true);
create policy "public read" on threads for select using (true);
create policy "public read" on thread_steps for select using (true);
create policy "public read" on event_views for select using (true);
-- No public policies on subscribers: only the service role can read or write.
