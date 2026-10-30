-- Each period answers ten fixed questions (see lib/questions.ts), keyed by question id.
alter table periods add column if not exists answers jsonb not null default '{}'::jsonb;
