-- Short notes on each subject within a period, keyed by area slug (plus "next").
alter table periods add column if not exists notes jsonb not null default '{}'::jsonb;
