-- Fivonine platform schema. Applied to project jhepbvepnuhavhgpsjwy.
-- Fivonine never moves money: campaigns list how organizers receive support.

-- 0. Remove the previous platform (it held no data).
drop policy if exists cover_owner_insert on storage.objects;
drop policy if exists cover_owner_or_admin_select on storage.objects;
drop policy if exists cover_owner_delete on storage.objects;
drop table if exists public.campaign_metrics, public.request_limits, public.email_outbox,
  public.review_events, public.contact_messages, public.reports, public.campaign_updates,
  public.campaign_revisions, public.campaigns, public.organizer_profiles, public.platform_admins cascade;
drop function if exists public.website_action(text,jsonb,text);
drop function if exists private.website_action(text,jsonb,text);
drop function if exists public.submit_campaign(jsonb,uuid);
drop function if exists private.submit_campaign(jsonb,uuid);
drop function if exists public.organizer_request(uuid,text,text,text);
drop function if exists private.organizer_request(uuid,text,text,text);
drop function if exists public.moderate_campaign(uuid,text,text,text,boolean,boolean);
drop function if exists private.moderate_campaign(uuid,text,text,text,boolean,boolean);
drop function if exists public.claim_email_batch();
drop function if exists public.record_outbound_click(uuid);
drop function if exists public.consume_rate_limit(text);
drop function if exists public.is_fivonine_admin();

create schema if not exists private;
grant usage on schema private to anon, authenticated;

-- 1. Tables
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  bio text not null default '' check (char_length(bio) <= 600),
  avatar_path text,
  department text,
  city text check (char_length(city) <= 80),
  kind text not null default 'individual' check (kind in ('individual','organization')),
  org_name text check (char_length(org_name) <= 120),
  org_type text check (char_length(org_type) <= 60),
  org_verified boolean not null default false,
  role text not null default 'user' check (role in ('user','admin')),
  banned boolean not null default false,
  locale text not null default 'ht' check (locale in ('ht','fr','en')),
  email_notifications boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.categories (
  slug text primary key check (slug ~ '^[a-z0-9-]{2,40}$'),
  name_ht text not null, name_fr text not null, name_en text not null,
  position int not null default 0,
  active boolean not null default true
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,120}$'),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft','pending','needs_changes','live','completed','closed','rejected','suspended')),
  title text not null check (char_length(title) between 4 and 120),
  story text not null default '' check (char_length(story) <= 8000),
  cause text references public.categories(slug) on update cascade,
  department text check (char_length(department) <= 40),
  commune text check (char_length(commune) <= 80),
  beneficiary_name text check (char_length(beneficiary_name) <= 120),
  beneficiary_relation text check (char_length(beneficiary_relation) <= 40),
  goal_amount numeric(14,2) check (goal_amount > 0),
  goal_currency text not null default 'HTG' check (goal_currency in ('HTG','USD')),
  deadline date,
  urgent boolean not null default false,
  emergency boolean not null default false,
  cover_path text,
  gallery text[] not null default '{}' check (cardinality(gallery) <= 6),
  video_url text check (video_url ~ '^https://' and char_length(video_url) <= 300),
  voice_path text,
  tier text not null default 'none' check (tier in ('none','id_checked','community','organization')),
  featured boolean not null default false,
  language text not null default 'ht' check (language in ('ht','fr','en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,
  published_at timestamptz
);
create index campaigns_public_idx on public.campaigns (status, published_at desc);
create index campaigns_owner_idx on public.campaigns (owner_id);
create index campaigns_cause_idx on public.campaigns (cause);

create table public.campaign_private (
  campaign_id uuid primary key references public.campaigns(id) on delete cascade,
  contact_name text check (char_length(contact_name) <= 120),
  contact_email text check (char_length(contact_email) <= 254),
  contact_details text check (char_length(contact_details) <= 600),
  id_front_path text, id_back_path text, selfie_path text,
  reference_name text check (char_length(reference_name) <= 120),
  reference_contact text check (char_length(reference_contact) <= 200),
  documents text[] not null default '{}' check (cardinality(documents) <= 8),
  consent_at timestamptz,
  review_note text check (char_length(review_note) <= 2000),
  updated_at timestamptz not null default now()
);

create table public.support_methods (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  method text not null check (method ~ '^[a-z_]{2,30}$'),
  details text not null check (char_length(details) between 3 and 600),
  position int not null default 0,
  unique (campaign_id, method)
);

create table public.campaign_members (
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (campaign_id, user_id)
);
create index campaign_members_user_idx on public.campaign_members (user_id);

create table public.campaign_updates (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  proof text[] not null default '{}' check (cardinality(proof) <= 6),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index campaign_updates_campaign_idx on public.campaign_updates (campaign_id, created_at desc);
create index campaign_updates_author_idx on public.campaign_updates (author_id);

create table public.bookmarks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  remind boolean not null default false,
  last_reminded timestamptz,
  created_at timestamptz not null default now(),
  primary key (user_id, campaign_id)
);
create index bookmarks_campaign_idx on public.bookmarks (campaign_id);

-- "I sent it": donor-reported support. Never verified by Fivonine.
create table public.contributions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(14,2) not null check (amount > 0 and amount <= 50000000),
  currency text not null check (currency in ('HTG','USD')),
  method text check (method ~ '^[a-z_]{2,30}$'),
  display_name text check (char_length(display_name) <= 80),
  anonymous boolean not null default false,
  message text check (char_length(message) <= 500),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index contributions_campaign_idx on public.contributions (campaign_id, created_at desc);
create index contributions_user_idx on public.contributions (user_id);

create table public.vouches (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  voucher_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('church','school','clinic','leader','organization','neighbor','other')),
  organization text check (char_length(organization) <= 120),
  statement text not null check (char_length(statement) between 10 and 600),
  status text not null default 'pending' check (status in ('pending','approved','declined')),
  created_at timestamptz not null default now(),
  unique (campaign_id, voucher_id)
);
create index vouches_voucher_idx on public.vouches (voucher_id);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null check (reason in ('scam','false_story','stolen_identity','payout_mismatch','prohibited','other')),
  body text not null default '' check (char_length(body) <= 2000),
  handled boolean not null default false,
  created_at timestamptz not null default now()
);
create index reports_campaign_idx on public.reports (campaign_id);
create index reports_reporter_idx on public.reports (reporter_id);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text check (char_length(name) <= 120),
  email text not null check (char_length(email) between 3 and 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  topic text check (char_length(topic) <= 60),
  body text not null check (char_length(body) between 1 and 4000),
  handled boolean not null default false,
  created_at timestamptz not null default now()
);
create index contact_messages_user_idx on public.contact_messages (user_id);

create table public.appeals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  body text not null check (char_length(body) between 10 and 2000),
  status text not null default 'open' check (status in ('open','accepted','declined')),
  admin_note text check (char_length(admin_note) <= 1000),
  created_at timestamptz not null default now()
);
create index appeals_user_idx on public.appeals (user_id);
create index appeals_campaign_idx on public.appeals (campaign_id);

create table public.blocklist (
  id uuid primary key default gen_random_uuid(),
  value text not null unique check (char_length(value) between 3 and 200),
  note text check (char_length(note) <= 300),
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null check (char_length(action) <= 60),
  target_type text not null check (char_length(target_type) <= 30),
  target_id text not null check (char_length(target_id) <= 80),
  note text check (char_length(note) <= 2000),
  created_at timestamptz not null default now()
);
create index audit_log_actor_idx on public.audit_log (actor_id);
create index audit_log_created_idx on public.audit_log (created_at desc);

create table public.settings (
  key text primary key,
  value jsonb not null
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  payload jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);
create index notifications_campaign_idx on public.notifications (campaign_id);

create table public.email_outbox (
  id uuid primary key default gen_random_uuid(),
  recipient text not null,
  locale text not null default 'ht',
  kind text not null,
  payload jsonb not null default '{}',
  attempts int not null default 0,
  sent_at timestamptz,
  processing_until timestamptz,
  last_error text,
  created_at timestamptz not null default now()
);
create index email_outbox_pending_idx on public.email_outbox (created_at) where sent_at is null;

-- 2. Helpers (private schema is not exposed through the Data API)
create function private.is_admin() returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.profiles where id=(select auth.uid()) and role='admin' and not banned) $$;
create function private.can_act() returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.profiles where id=(select auth.uid()) and not banned) $$;
create function private.owns_campaign(cid uuid) returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.campaigns where id=cid and owner_id=(select auth.uid())) $$;
create function private.is_member(cid uuid) returns boolean language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.campaign_members where campaign_id=cid and user_id=(select auth.uid())) $$;
-- True for SQL/console sessions and for platform admins.
create function private.trusted() returns boolean language sql stable set search_path='' as $$
  select current_user not in ('anon','authenticated') or private.is_admin() $$;
create function private.valid_backend(secret text) returns boolean language sql stable security definer set search_path='' as $$
  select secret is not null and exists(select 1 from private.backend_credentials
    where token_hash=encode(sha256(convert_to(secret,'UTF8')),'hex')) $$;

create function private.notify(uid uuid, k text, cid uuid, p jsonb) returns void
language plpgsql security definer set search_path='' as $$
begin
  if uid is null then return; end if;
  insert into public.notifications(user_id,kind,campaign_id,payload) values(uid,k,cid,p);
  insert into public.email_outbox(recipient,locale,kind,payload)
    select u.email, pr.locale, k, p from auth.users u join public.profiles pr on pr.id=u.id
    where u.id=uid and pr.email_notifications and not pr.banned and u.email is not null;
end $$;

create function private.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
begin
  insert into public.profiles(id,display_name,locale) values (
    new.id,
    coalesce(nullif(left(btrim(new.raw_user_meta_data->>'display_name'),80),''),'Fivonine member'),
    case when new.raw_user_meta_data->>'locale' in ('ht','fr','en') then new.raw_user_meta_data->>'locale' else 'ht' end
  ) on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists fivonine_new_user on auth.users;
create trigger fivonine_new_user after insert on auth.users for each row execute function private.handle_new_user();

create function private.guard_profile() returns trigger language plpgsql set search_path='' as $$
begin
  if private.trusted() then return new; end if;
  new.id:=old.id; new.role:=old.role; new.banned:=old.banned; new.created_at:=old.created_at;
  new.org_verified:=old.org_verified;
  if new.kind is distinct from old.kind or new.org_name is distinct from old.org_name then new.org_verified:=false; end if;
  return new;
end $$;
create trigger guard_profile before update on public.profiles for each row execute function private.guard_profile();

create function private.guard_campaign() returns trigger language plpgsql set search_path='' as $$
declare changed boolean; n int;
begin
  if tg_op='INSERT' then
    if not private.trusted() then
      if not private.can_act() then raise exception 'Account restricted'; end if;
      select count(*) into n from public.campaigns where owner_id=new.owner_id and created_at>now()-interval '1 day';
      if n>=5 then raise exception 'Daily campaign limit reached'; end if;
      new.featured:=false; new.tier:='none'; new.emergency:=false; new.published_at:=null;
      if new.status not in ('draft','pending') then new.status:='draft'; end if;
    end if;
    if new.status='pending' then new.submitted_at:=now(); end if;
    return new;
  end if;
  new.updated_at:=now();
  if private.trusted() then
    if new.status='live' and old.status<>'live' and new.published_at is null then new.published_at:=now(); end if;
    return new;
  end if;
  if not private.can_act() then raise exception 'Account restricted'; end if;
  new.id:=old.id; new.owner_id:=old.owner_id; new.slug:=old.slug; new.featured:=old.featured; new.tier:=old.tier;
  new.emergency:=old.emergency; new.created_at:=old.created_at; new.published_at:=old.published_at;
  new.submitted_at:=old.submitted_at;
  changed := (new.title,new.story,new.cause,new.department,new.commune,new.beneficiary_name,new.beneficiary_relation,
              new.goal_amount,new.goal_currency,new.deadline,new.urgent,new.cover_path,new.gallery,new.video_url,new.voice_path,new.language)
    is distinct from
             (old.title,old.story,old.cause,old.department,old.commune,old.beneficiary_name,old.beneficiary_relation,
              old.goal_amount,old.goal_currency,old.deadline,old.urgent,old.cover_path,old.gallery,old.video_url,old.voice_path,old.language);
  if old.status in ('suspended','completed','closed') then raise exception 'This campaign can no longer be changed'; end if;
  if new.status=old.status then
    if old.status='live' and changed then new.status:='pending'; new.submitted_at:=now(); end if;
  elsif (old.status,new.status) in (('draft','pending'),('needs_changes','pending'),('rejected','pending'),('live','pending'),
        ('pending','draft'),('draft','closed'),('pending','closed'),('needs_changes','closed'),('rejected','closed')) then
    if new.status='pending' then new.submitted_at:=now(); end if;
  elsif old.status='live' and new.status in ('completed','closed') then
    if changed then raise exception 'Save your changes before closing the campaign'; end if;
  else
    raise exception 'Status change not allowed';
  end if;
  return new;
end $$;
create trigger guard_campaign before insert or update on public.campaigns for each row execute function private.guard_campaign();

create function private.campaign_notify() returns trigger language plpgsql security definer set search_path='' as $$
declare a record; note text;
begin
  if tg_op='UPDATE' and new.status is not distinct from old.status then return null; end if;
  if new.status='pending' then
    for a in select id from public.profiles where role='admin' and not banned loop
      perform private.notify(a.id,'admin_pending',new.id,jsonb_build_object('title',new.title,'slug',new.slug));
    end loop;
  elsif tg_op='UPDATE' and new.status in ('live','needs_changes','rejected','suspended') then
    select review_note into note from public.campaign_private where campaign_id=new.id;
    perform private.notify(new.owner_id,'campaign_'||new.status,new.id,
      jsonb_build_object('title',new.title,'slug',new.slug,'note',coalesce(note,'')));
  end if;
  return null;
end $$;
create trigger campaign_notify after insert or update on public.campaigns for each row execute function private.campaign_notify();

create function private.guard_method() returns trigger language plpgsql set search_path='' as $$
declare cid uuid; st text; n int;
begin
  if tg_op='DELETE' then cid:=old.campaign_id; else cid:=new.campaign_id; end if;
  if not private.trusted() then
    select status into st from public.campaigns where id=cid;
    if st in ('suspended','completed','closed') then raise exception 'This campaign can no longer be changed'; end if;
    if tg_op='INSERT' then
      select count(*) into n from public.support_methods where campaign_id=cid;
      if n>=12 then raise exception 'Too many support methods'; end if;
    end if;
    if st='live' then update public.campaigns set status='pending' where id=cid; end if;
  end if;
  if tg_op='DELETE' then return old; end if;
  return new;
end $$;
create trigger guard_method before insert or update or delete on public.support_methods for each row execute function private.guard_method();

create function private.touch_private() returns trigger language plpgsql set search_path='' as $$
begin
  new.updated_at:=now();
  if not private.trusted() then new.review_note:=old.review_note; new.campaign_id:=old.campaign_id; end if;
  return new;
end $$;
create trigger touch_private before update on public.campaign_private for each row execute function private.touch_private();

create function private.guard_contribution() returns trigger language plpgsql security definer set search_path='' as $$
declare n int;
begin
  select count(*) into n from public.contributions where user_id=new.user_id and campaign_id=new.campaign_id and created_at>now()-interval '1 day';
  if n>=5 then raise exception 'Daily limit reached for this campaign'; end if;
  if new.anonymous then new.display_name:=null; end if;
  new.hidden:=false;
  return new;
end $$;
create trigger guard_contribution before insert on public.contributions for each row execute function private.guard_contribution();

create function private.contribution_notify() returns trigger language plpgsql security definer set search_path='' as $$
declare c record;
begin
  select owner_id,title,slug into c from public.campaigns where id=new.campaign_id;
  if c.owner_id is distinct from new.user_id then
    perform private.notify(c.owner_id,'new_contribution',new.campaign_id,
      jsonb_build_object('title',c.title,'slug',c.slug,'amount',new.amount,'currency',new.currency));
  end if;
  return null;
end $$;
create trigger contribution_notify after insert on public.contributions for each row execute function private.contribution_notify();

create function private.update_notify() returns trigger language plpgsql security definer set search_path='' as $$
declare c record; b record;
begin
  select title,slug into c from public.campaigns where id=new.campaign_id;
  for b in select user_id from public.bookmarks where campaign_id=new.campaign_id and user_id<>new.author_id loop
    perform private.notify(b.user_id,'campaign_update',new.campaign_id,jsonb_build_object('title',c.title,'slug',c.slug));
  end loop;
  return null;
end $$;
create trigger update_notify after insert on public.campaign_updates for each row execute function private.update_notify();

create function private.guard_report() returns trigger language plpgsql security definer set search_path='' as $$
declare n int; a record; c record;
begin
  select count(*) into n from public.reports where reporter_id=new.reporter_id and created_at>now()-interval '1 day';
  if n>=10 then raise exception 'Daily report limit reached'; end if;
  new.handled:=false;
  select title,slug into c from public.campaigns where id=new.campaign_id;
  for a in select id from public.profiles where role='admin' and not banned loop
    insert into public.notifications(user_id,kind,campaign_id,payload)
      values(a.id,'admin_report',new.campaign_id,jsonb_build_object('title',c.title,'slug',c.slug));
  end loop;
  return new;
end $$;
create trigger guard_report before insert on public.reports for each row execute function private.guard_report();

create function private.guard_vouch() returns trigger language plpgsql security definer set search_path='' as $$
declare c record;
begin
  if tg_op='INSERT' then new.status:='pending'; return new; end if;
  if new.status='approved' and old.status<>'approved' then
    select owner_id,title,slug into c from public.campaigns where id=new.campaign_id;
    perform private.notify(c.owner_id,'vouch_approved',new.campaign_id,jsonb_build_object('title',c.title,'slug',c.slug));
  end if;
  return new;
end $$;
create trigger guard_vouch before insert or update on public.vouches for each row execute function private.guard_vouch();

create function private.guard_contact() returns trigger language plpgsql security definer set search_path='' as $$
declare n int;
begin
  select count(*) into n from public.contact_messages where created_at>now()-interval '1 hour';
  if n>=60 then raise exception 'Too many messages right now. Try again later.'; end if;
  new.handled:=false;
  return new;
end $$;
create trigger guard_contact before insert on public.contact_messages for each row execute function private.guard_contact();

-- 3. Row level security
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_private enable row level security;
alter table public.support_methods enable row level security;
alter table public.campaign_members enable row level security;
alter table public.campaign_updates enable row level security;
alter table public.bookmarks enable row level security;
alter table public.contributions enable row level security;
alter table public.vouches enable row level security;
alter table public.reports enable row level security;
alter table public.contact_messages enable row level security;
alter table public.appeals enable row level security;
alter table public.blocklist enable row level security;
alter table public.audit_log enable row level security;
alter table public.settings enable row level security;
alter table public.notifications enable row level security;
alter table public.email_outbox enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant select on public.profiles, public.categories, public.campaigns, public.support_methods,
  public.campaign_members, public.campaign_updates, public.vouches, public.settings to anon, authenticated;
grant select (id,campaign_id,amount,currency,method,display_name,anonymous,message,hidden,created_at)
  on public.contributions to anon, authenticated;
grant insert (campaign_id,user_id,amount,currency,method,display_name,anonymous,message) on public.contributions to authenticated;
grant update (hidden) on public.contributions to authenticated;
grant delete on public.contributions to authenticated;
grant update on public.profiles to authenticated;
grant insert, update, delete on public.categories, public.campaigns, public.support_methods,
  public.campaign_updates, public.vouches, public.settings, public.blocklist to authenticated;
grant select, insert, update, delete on public.campaign_private, public.bookmarks, public.appeals to authenticated;
grant select, insert, update on public.reports to authenticated;
grant select, update, delete on public.contact_messages to authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant select on public.blocklist to authenticated;
grant select, insert on public.audit_log to authenticated;
grant select, update, delete on public.notifications to authenticated;
grant delete on public.campaign_members to authenticated;

create policy profiles_read on public.profiles for select to anon, authenticated using (true);
create policy profiles_update on public.profiles for update to authenticated
  using (id=(select auth.uid()) or (select private.is_admin())) with check (id=(select auth.uid()) or (select private.is_admin()));

create policy categories_read on public.categories for select to anon, authenticated using (true);
create policy categories_insert on public.categories for insert to authenticated with check ((select private.is_admin()));
create policy categories_update on public.categories for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy categories_delete on public.categories for delete to authenticated using ((select private.is_admin()));

create policy campaigns_public on public.campaigns for select to anon using (status in ('live','completed'));
create policy campaigns_member on public.campaigns for select to authenticated
  using (status in ('live','completed') or owner_id=(select auth.uid()) or (select private.is_admin()) or private.is_member(id));
create policy campaigns_insert on public.campaigns for insert to authenticated with check (owner_id=(select auth.uid()));
create policy campaigns_update on public.campaigns for update to authenticated
  using (owner_id=(select auth.uid()) or (select private.is_admin())) with check (owner_id=(select auth.uid()) or (select private.is_admin()));
create policy campaigns_delete on public.campaigns for delete to authenticated
  using ((owner_id=(select auth.uid()) and status in ('draft','rejected','needs_changes')) or (select private.is_admin()));

create policy private_all on public.campaign_private for all to authenticated
  using (private.owns_campaign(campaign_id) or (select private.is_admin()))
  with check (private.owns_campaign(campaign_id) or (select private.is_admin()));

create policy methods_read on public.support_methods for select to anon, authenticated
  using (exists(select 1 from public.campaigns c where c.id=campaign_id));
create policy methods_insert on public.support_methods for insert to authenticated
  with check (private.owns_campaign(campaign_id) or (select private.is_admin()));
create policy methods_update on public.support_methods for update to authenticated
  using (private.owns_campaign(campaign_id) or (select private.is_admin()))
  with check (private.owns_campaign(campaign_id) or (select private.is_admin()));
create policy methods_delete on public.support_methods for delete to authenticated
  using (private.owns_campaign(campaign_id) or (select private.is_admin()));

create policy members_read on public.campaign_members for select to anon, authenticated
  using (exists(select 1 from public.campaigns c where c.id=campaign_id));
create policy members_delete on public.campaign_members for delete to authenticated
  using (user_id=(select auth.uid()) or private.owns_campaign(campaign_id) or (select private.is_admin()));

create policy updates_read_public on public.campaign_updates for select to anon
  using (not hidden and exists(select 1 from public.campaigns c where c.id=campaign_id));
create policy updates_read on public.campaign_updates for select to authenticated
  using ((not hidden and exists(select 1 from public.campaigns c where c.id=campaign_id))
    or author_id=(select auth.uid()) or (select private.is_admin()));
create policy updates_insert on public.campaign_updates for insert to authenticated
  with check (author_id=(select auth.uid()) and (select private.can_act())
    and (private.owns_campaign(campaign_id) or private.is_member(campaign_id))
    and exists(select 1 from public.campaigns c where c.id=campaign_id and c.status in ('live','completed')));
create policy updates_update on public.campaign_updates for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy updates_delete on public.campaign_updates for delete to authenticated
  using (author_id=(select auth.uid()) or (select private.is_admin()));

create policy bookmarks_all on public.bookmarks for all to authenticated
  using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));

create policy contributions_read_public on public.contributions for select to anon
  using (not hidden and exists(select 1 from public.campaigns c where c.id=campaign_id));
create policy contributions_read on public.contributions for select to authenticated
  using ((not hidden and exists(select 1 from public.campaigns c where c.id=campaign_id))
    or user_id=(select auth.uid()) or (select private.is_admin()));
create policy contributions_insert on public.contributions for insert to authenticated
  with check (user_id=(select auth.uid()) and (select private.can_act())
    and exists(select 1 from public.campaigns c where c.id=campaign_id and c.status in ('live','completed')));
create policy contributions_update on public.contributions for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy contributions_delete on public.contributions for delete to authenticated
  using (user_id=(select auth.uid()) or (select private.is_admin()));

create policy vouches_read_public on public.vouches for select to anon
  using (status='approved' and exists(select 1 from public.campaigns c where c.id=campaign_id));
create policy vouches_read on public.vouches for select to authenticated
  using ((status='approved' and exists(select 1 from public.campaigns c where c.id=campaign_id))
    or voucher_id=(select auth.uid()) or (select private.is_admin()));
create policy vouches_insert on public.vouches for insert to authenticated
  with check (voucher_id=(select auth.uid()) and (select private.can_act()) and not private.owns_campaign(campaign_id)
    and exists(select 1 from public.campaigns c where c.id=campaign_id and c.status='live'));
create policy vouches_update on public.vouches for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy vouches_delete on public.vouches for delete to authenticated
  using (voucher_id=(select auth.uid()) or (select private.is_admin()));

create policy reports_read on public.reports for select to authenticated using ((select private.is_admin()));
create policy reports_insert on public.reports for insert to authenticated
  with check (reporter_id=(select auth.uid()) and (select private.can_act()));
create policy reports_update on public.reports for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

create policy contact_insert_anon on public.contact_messages for insert to anon with check (user_id is null);
create policy contact_insert on public.contact_messages for insert to authenticated
  with check (user_id is null or user_id=(select auth.uid()));
create policy contact_read on public.contact_messages for select to authenticated using ((select private.is_admin()));
create policy contact_update on public.contact_messages for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy contact_delete on public.contact_messages for delete to authenticated using ((select private.is_admin()));

create policy appeals_read on public.appeals for select to authenticated
  using (user_id=(select auth.uid()) or (select private.is_admin()));
create policy appeals_insert on public.appeals for insert to authenticated
  with check (user_id=(select auth.uid()) and status='open' and admin_note is null);
create policy appeals_update on public.appeals for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy appeals_delete on public.appeals for delete to authenticated using ((select private.is_admin()));

create policy blocklist_read on public.blocklist for select to authenticated using ((select private.is_admin()));
create policy blocklist_insert on public.blocklist for insert to authenticated with check ((select private.is_admin()));
create policy blocklist_update on public.blocklist for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy blocklist_delete on public.blocklist for delete to authenticated using ((select private.is_admin()));

create policy audit_read on public.audit_log for select to authenticated using ((select private.is_admin()));
create policy audit_insert on public.audit_log for insert to authenticated
  with check ((select private.is_admin()) and actor_id=(select auth.uid()));

create policy settings_read on public.settings for select to anon, authenticated using (true);
create policy settings_insert on public.settings for insert to authenticated with check ((select private.is_admin()));
create policy settings_update on public.settings for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy settings_delete on public.settings for delete to authenticated using ((select private.is_admin()));

create policy notifications_read on public.notifications for select to authenticated using (user_id=(select auth.uid()));
create policy notifications_update on public.notifications for update to authenticated
  using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create policy notifications_delete on public.notifications for delete to authenticated using (user_id=(select auth.uid()));

-- 4. Self-reported progress per campaign (follows the reader's row access).
create view public.campaign_progress with (security_invoker = true) as
  select campaign_id,
    coalesce(sum(amount) filter (where currency='HTG'),0) as total_htg,
    coalesce(sum(amount) filter (where currency='USD'),0) as total_usd,
    count(*)::int as supporters
  from public.contributions where not hidden group by campaign_id;
grant select on public.campaign_progress to anon, authenticated;

-- 5. RPCs. Privileged bodies live in private; public wrappers are plain invokers.
create function private.add_team_member(cid uuid, member_email text) returns text
language plpgsql security definer set search_path='' as $$
declare uid uuid; n int;
begin
  if not exists(select 1 from public.campaigns where id=cid and owner_id=(select auth.uid())) then return 'forbidden'; end if;
  select count(*) into n from public.campaign_members where campaign_id=cid;
  if n>=10 then return 'full'; end if;
  select id into uid from auth.users where lower(email)=lower(btrim(member_email)) and email_confirmed_at is not null;
  if uid is null then return 'not_found'; end if;
  if uid=(select auth.uid()) then return 'self'; end if;
  insert into public.campaign_members(campaign_id,user_id) values(cid,uid) on conflict do nothing;
  return 'ok';
end $$;
create function public.add_team_member(cid uuid, member_email text) returns text
language sql security invoker set search_path='' as $$ select private.add_team_member(cid, member_email) $$;

create function private.fraud_signals(cid uuid) returns table(kind text, other_id uuid, other_title text, detail text)
language plpgsql stable security definer set search_path='' as $$
begin
  if not private.is_admin() then return; end if;
  return query
  with mine as (
    select distinct m[1] as token from public.support_methods s,
      regexp_matches(regexp_replace(s.details,'[\s\-\.\(\)\+]','','g'),'\d{7,}','g') m where s.campaign_id=cid
    union
    select distinct lower(m[1]) from public.support_methods s,
      regexp_matches(s.details,'([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})','g') m where s.campaign_id=cid
  )
  select 'shared_payout'::text, c.id, c.title, mine.token
    from mine join public.support_methods s on s.campaign_id<>cid
      and position(mine.token in lower(regexp_replace(s.details,'[\s\-\.\(\)\+]','','g')))>0
    join public.campaigns c on c.id=s.campaign_id
  union
  select 'shared_contact', c.id, c.title, coalesce(p2.contact_email,p2.reference_contact)
    from public.campaign_private p1 join public.campaign_private p2 on p2.campaign_id<>p1.campaign_id
      and ((p1.contact_email is not null and lower(p1.contact_email)=lower(p2.contact_email))
        or (p1.reference_contact is not null and lower(p1.reference_contact)=lower(p2.reference_contact)))
    join public.campaigns c on c.id=p2.campaign_id
    join public.campaigns me on me.id=p1.campaign_id and me.owner_id<>c.owner_id
    where p1.campaign_id=cid
  union
  select 'blocklist', null::uuid, null::text, b.value
    from public.blocklist b where exists(
      select 1 from public.support_methods s where s.campaign_id=cid
        and (position(lower(b.value) in lower(s.details))>0
          or position(lower(b.value) in lower(regexp_replace(s.details,'[\s\-\.\(\)\+]','','g')))>0))
      or exists(select 1 from public.campaign_private p where p.campaign_id=cid
        and (position(lower(b.value) in lower(coalesce(p.contact_email,'')))>0
          or position(lower(b.value) in lower(coalesce(p.contact_details,'')))>0
          or position(lower(b.value) in lower(coalesce(p.reference_contact,'')))>0));
end $$;
create function public.fraud_signals(cid uuid) returns table(kind text, other_id uuid, other_title text, detail text)
language sql stable security invoker set search_path='' as $$ select * from private.fraud_signals(cid) $$;

create function private.public_stats() returns jsonb language sql stable security definer set search_path='' as $$
  select jsonb_build_object(
    'live',(select count(*) from public.campaigns where status='live'),
    'completed',(select count(*) from public.campaigns where status='completed'),
    'reviewed',(select count(*) from public.campaigns where status in ('live','completed','closed','rejected','suspended','needs_changes')),
    'declined',(select count(*) from public.campaigns where status in ('rejected','suspended')),
    'verified',(select count(*) from public.campaigns where status in ('live','completed') and tier<>'none'),
    'reports_handled',(select count(*) from public.reports where handled),
    'supporters',(select count(*) from public.contributions where not hidden),
    'reported_htg',(select coalesce(sum(amount),0) from public.contributions where not hidden and currency='HTG'),
    'reported_usd',(select coalesce(sum(amount),0) from public.contributions where not hidden and currency='USD')) $$;
create function public.public_stats() returns jsonb language sql stable security invoker set search_path='' as $$ select private.public_stats() $$;

create function private.claim_email_batch(backend_secret text) returns setof public.email_outbox
language plpgsql security definer set search_path='' as $$
begin
  if not private.valid_backend(backend_secret) then raise exception 'Unauthorized'; end if;
  return query update public.email_outbox set processing_until=now()+interval '5 minutes', attempts=attempts+1
    where id in (select id from public.email_outbox where sent_at is null and attempts<5
      and (processing_until is null or processing_until<now()) order by created_at limit 20 for update skip locked)
    returning *;
end $$;
create function public.claim_email_batch(backend_secret text) returns setof public.email_outbox
language sql security invoker set search_path='' as $$ select * from private.claim_email_batch(backend_secret) $$;

create function private.finish_email(backend_secret text, email_id uuid, ok boolean, err text) returns void
language plpgsql security definer set search_path='' as $$
begin
  if not private.valid_backend(backend_secret) then raise exception 'Unauthorized'; end if;
  update public.email_outbox set sent_at=case when ok then now() else null end, processing_until=null,
    last_error=case when ok then null else left(err,200) end where id=email_id;
end $$;
create function public.finish_email(backend_secret text, email_id uuid, ok boolean, err text) returns void
language sql security invoker set search_path='' as $$ select private.finish_email(backend_secret,email_id,ok,err) $$;

create function private.enqueue_reminders(backend_secret text) returns int
language plpgsql security definer set search_path='' as $$
declare b record; n int:=0;
begin
  if not private.valid_backend(backend_secret) then raise exception 'Unauthorized'; end if;
  for b in select bm.user_id, bm.campaign_id, c.title, c.slug from public.bookmarks bm
      join public.campaigns c on c.id=bm.campaign_id and c.status='live'
      where bm.remind and (bm.last_reminded is null or bm.last_reminded<now()-interval '30 days')
        and bm.created_at<now()-interval '30 days' limit 500 loop
    perform private.notify(b.user_id,'reminder',b.campaign_id,jsonb_build_object('title',b.title,'slug',b.slug));
    update public.bookmarks set last_reminded=now() where user_id=b.user_id and campaign_id=b.campaign_id;
    n:=n+1;
  end loop;
  return n;
end $$;
create function public.enqueue_reminders(backend_secret text) returns int
language sql security invoker set search_path='' as $$ select private.enqueue_reminders(backend_secret) $$;

revoke all on all functions in schema private from public;
revoke all on all functions in schema public from public, anon, authenticated;
grant execute on all functions in schema private to anon, authenticated;
grant execute on function public.public_stats(), public.claim_email_batch(text), public.finish_email(text,uuid,boolean,text),
  public.enqueue_reminders(text) to anon, authenticated;
grant execute on function public.add_team_member(uuid,text), public.fraud_signals(uuid) to authenticated;

-- 6. Storage: public media (photos, voice notes) and private verification documents.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values
  ('media','media',true,8388608,array['image/webp','image/jpeg','image/png','audio/webm','audio/mp4','audio/ogg','audio/mpeg']),
  ('documents','documents',false,10485760,array['image/webp','image/jpeg','image/png','application/pdf'])
on conflict (id) do update set public=excluded.public, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;
create policy media_insert on storage.objects for insert to authenticated
  with check (bucket_id='media' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy media_delete on storage.objects for delete to authenticated
  using (bucket_id='media' and ((storage.foldername(name))[1]=(select auth.uid())::text or (select private.is_admin())));
create policy documents_insert on storage.objects for insert to authenticated
  with check (bucket_id='documents' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy documents_read on storage.objects for select to authenticated
  using (bucket_id='documents' and ((storage.foldername(name))[1]=(select auth.uid())::text or (select private.is_admin())));
create policy documents_delete on storage.objects for delete to authenticated
  using (bucket_id='documents' and (storage.foldername(name))[1]=(select auth.uid())::text);

-- 7. Seed data
insert into public.categories(slug,name_ht,name_fr,name_en,position) values
  ('medical','Swen sante','Soins médicaux','Medical care',1),
  ('education','Edikasyon','Éducation','Education',2),
  ('emergency','Ijans ak katastwòf','Urgence et catastrophe','Emergency and disaster',3),
  ('funeral','Antèman','Funérailles','Funeral',4),
  ('housing','Kay ak lwaye','Logement','Housing',5),
  ('food','Manje','Alimentation','Food',6),
  ('business','Ti biznis','Petit commerce','Small business',7),
  ('community','Pwojè kominotè','Projet communautaire','Community project',8),
  ('other','Lòt bezwen','Autre besoin','Other need',9);
insert into public.settings(key,value) values
  ('emergency','{"active":false,"ht":"","fr":"","en":""}'),
  ('rate','{"htg_per_usd":131}');
