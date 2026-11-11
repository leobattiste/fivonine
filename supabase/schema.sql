-- fivonine: apply only to this application's dedicated Supabase project.
-- No payment, donor, wallet or banking tables. Public content and private contacts are separate.
create extension if not exists pgcrypto;
create table public.platform_admins(user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.platform_admins enable row level security;
grant select on public.platform_admins to authenticated;
create policy self_admin on public.platform_admins for select to authenticated using(user_id=(select auth.uid()));
create function public.is_fivonine_admin() returns boolean language sql stable security invoker set search_path='' as $$ select exists(select 1 from public.platform_admins where user_id=(select auth.uid())) $$;
revoke all on function public.is_fivonine_admin() from public,anon;
grant execute on function public.is_fivonine_admin() to authenticated;
create table public.organizer_profiles(user_id uuid primary key references auth.users(id) on delete cascade,display_name text not null,email text not null,created_at timestamptz not null default now());
create table public.campaigns(id uuid primary key default gen_random_uuid(),owner_id uuid not null references auth.users(id),status text not null default 'pending' check(status in('pending','published','needs_changes','declined','suspended','archived','removal_requested')),public_content jsonb not null default '{}',featured boolean not null default false,contact_confirmed boolean not null default false,links_checked_at timestamptz,organization_reviewed_at timestamptz,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),search_document tsvector generated always as(to_tsvector('simple',coalesce(public_content->>'title','')||' '||coalesce(public_content->>'story','')||' '||coalesce(public_content->>'organizer_name','')||' '||coalesce(public_content->>'region','')||' '||coalesce(public_content->>'country','')||' '||coalesce(public_content->>'category',''))) stored);
create table public.campaign_revisions(id uuid primary key default gen_random_uuid(),campaign_id uuid not null references public.campaigns on delete cascade,content jsonb not null,status text not null default 'pending' check(status in('pending','approved','needs_changes','declined','superseded')),review_note text,consent_confirmed_at timestamptz not null default now(),policy_version text not null default 'draft-2026-11-08',created_at timestamptz not null default now(),reviewed_at timestamptz);
create unique index one_pending_revision on public.campaign_revisions(campaign_id) where status='pending';
create table public.campaign_updates(id uuid primary key default gen_random_uuid(),campaign_id uuid not null references public.campaigns on delete cascade,title text not null,body text not null,status text not null default 'pending' check(status in('pending','approved','declined')),created_at timestamptz not null default now());
create table public.reports(id uuid primary key default gen_random_uuid(),campaign_id uuid not null references public.campaigns,email text not null,reason text not null,body text not null,handled boolean not null default false,created_at timestamptz not null default now());
create table public.contact_messages(id uuid primary key default gen_random_uuid(),name text,email text not null,body text not null,reason text,handled boolean not null default false,created_at timestamptz not null default now());
create table public.review_events(id uuid primary key default gen_random_uuid(),campaign_id uuid references public.campaigns,actor_id uuid references auth.users,action text not null,note text,created_at timestamptz not null default now());
create table public.email_outbox(id uuid primary key default gen_random_uuid(),recipient text not null,subject text not null,body text not null,attempts int not null default 0,sent_at timestamptz,processing_until timestamptz,last_error text,created_at timestamptz not null default now());
create table public.request_limits(bucket text primary key,hits int not null default 1,window_started timestamptz not null default now());
create index campaign_search_idx on public.campaigns using gin(search_document);
create index campaign_status_date_idx on public.campaigns(status,created_at desc,id);
create index campaign_owner_idx on public.campaigns(owner_id);
create index revision_campaign_idx on public.campaign_revisions(campaign_id);
create index update_campaign_idx on public.campaign_updates(campaign_id);
create index report_campaign_idx on public.reports(campaign_id);
create index review_campaign_idx on public.review_events(campaign_id);
-- Only RPCs can change campaign records. Readers never receive private contacts through public policies.
alter table public.organizer_profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_revisions enable row level security;
alter table public.campaign_updates enable row level security;
alter table public.reports enable row level security;
alter table public.contact_messages enable row level security;
alter table public.review_events enable row level security;
alter table public.email_outbox enable row level security;
alter table public.request_limits enable row level security;
revoke all on public.organizer_profiles,public.campaigns,public.campaign_revisions,public.campaign_updates,public.reports,public.contact_messages,public.review_events,public.email_outbox,public.request_limits from anon,authenticated;
grant select on public.campaigns,public.campaign_updates to anon,authenticated;
grant select on public.organizer_profiles,public.campaign_revisions,public.reports,public.contact_messages,public.review_events to authenticated;
grant all on public.organizer_profiles,public.campaigns,public.campaign_revisions,public.campaign_updates,public.reports,public.contact_messages,public.review_events,public.email_outbox,public.request_limits to service_role;
create policy public_campaign on public.campaigns for select to anon using(status='published');
create policy member_campaign on public.campaigns for select to authenticated using(status='published' or owner_id=(select auth.uid()) or (select public.is_fivonine_admin()));
create policy own_contact on public.organizer_profiles for select to authenticated using(user_id=(select auth.uid()) or (select public.is_fivonine_admin()));
create policy own_revision on public.campaign_revisions for select to authenticated using(exists(select 1 from public.campaigns c where c.id=campaign_id and(c.owner_id=(select auth.uid()) or (select public.is_fivonine_admin()))));
create policy public_update on public.campaign_updates for select to anon using(status='approved' and exists(select 1 from public.campaigns c where c.id=campaign_id and c.status='published'));
create policy member_update on public.campaign_updates for select to authenticated using(exists(select 1 from public.campaigns c where c.id=campaign_id and((campaign_updates.status='approved' and c.status='published') or c.owner_id=(select auth.uid()) or (select public.is_fivonine_admin()))));
create policy admin_reports on public.reports for select to authenticated using((select public.is_fivonine_admin()));
create policy admin_messages on public.contact_messages for select to authenticated using((select public.is_fivonine_admin()));
create policy admin_events on public.review_events for select to authenticated using((select public.is_fivonine_admin()));
create function public.submit_campaign(content jsonb,campaign_id uuid default null) returns uuid language plpgsql security definer set search_path='' as $$
declare actor uuid:=auth.uid(); cid uuid; current_row public.campaigns; clean jsonb; contact text;
begin
 if actor is null then raise exception 'Sign in required';end if;
 if coalesce(content->>'consent','')<>'true' or coalesce(content->>'accuracy','')<>'true' or coalesce(content->>'terms','')<>'true' then raise exception 'Consent required';end if;
 if octet_length(content::text)>120000 then raise exception 'Submission too large';end if;
 select email into contact from auth.users where id=actor and email_confirmed_at is not null;
 if contact is null then raise exception 'Confirm email first';end if;
 if jsonb_typeof(content)<>'object' or coalesce(length(content->>'title'),0) not between 1 and 160 or coalesce(length(content->>'story'),0) not between 1 and 10000 or coalesce(length(content->>'support_text'),0) not between 1 and 4000 or coalesce(content->>'category','') not in('education','medical','emergencies','community','personal') or coalesce(content->>'language','') not in('en','fr','ht') then raise exception 'Invalid campaign';end if;
 if coalesce(length(content->>'country'),0) not between 1 and 80 or coalesce(length(content->>'region'),0) not between 1 and 100 or coalesce(length(content->>'organizer_name'),0) not between 1 and 160 or coalesce(length(content->>'beneficiary'),0) not between 1 and 300 or coalesce(length(content->>'relationship'),0) not between 1 and 200 or coalesce(length(content->>'intended_use'),0) not between 1 and 3000 or coalesce(length(content->>'distribution'),0) not between 1 and 3000 or coalesce(content->>'currency','') not in('USD','HTG','CAD','EUR','GBP','DOP') then raise exception 'Invalid campaign details';end if;
 if content->'goal' is not null and content->'goal'<>'null'::jsonb then
 if jsonb_typeof(content->'goal')<>'number' then raise exception 'Invalid goal';end if;
 if (content->>'goal')::numeric<=0 or (content->>'goal')::numeric>100000000 then raise exception 'Invalid goal';end if;end if;
 if (select count(*) from public.campaign_revisions r join public.campaigns c on c.id=r.campaign_id where c.owner_id=actor and r.created_at>now()-interval '1 hour')>=10 then raise exception 'Please try later';end if;
 if coalesce(content->>'lifecycle','active') not in('active','completed') then raise exception 'Invalid campaign status';end if;
 if coalesce(content->>'fundraising_url','')<>'' and (length(content->>'fundraising_url')>1000 or content->>'fundraising_url' !~ '^https://[^[:space:]]+') then raise exception 'Invalid fundraising URL';end if;
 select jsonb_object_agg(key,value) into clean from jsonb_each(content) where key in('title','story','category','country','region','organizer_name','relationship','beneficiary','intended_use','distribution','support_text','photo_url','goal','currency','language','fundraising_url','lifecycle');
 insert into public.organizer_profiles(user_id,display_name,email) values(actor,clean->>'organizer_name',contact) on conflict(user_id) do update set display_name=excluded.display_name,email=excluded.email;
 if campaign_id is null then insert into public.campaigns(owner_id) values(actor) returning id into cid;
 else select * into current_row from public.campaigns where id=campaign_id for update;
 if not found or current_row.owner_id<>actor or current_row.status in('archived','suspended','removal_requested') then raise exception 'Not permitted';end if;cid:=campaign_id;
 end if;
 update public.campaign_revisions set status='superseded' where campaign_revisions.campaign_id=cid and status='pending';
 insert into public.campaign_revisions(campaign_id,content) values(cid,clean);
 update public.campaigns set status=case when status='published' then status else 'pending' end,updated_at=now() where id=cid;
 insert into public.review_events(campaign_id,actor_id,action) values(cid,actor,'submission');
 insert into public.email_outbox(recipient,subject,body) values(contact,'Pote Kole: submission received','Your campaign is waiting for review. Sign in to Pote Kole to follow its status.');
 return cid;
end $$;
create function public.organizer_request(campaign_id uuid,request_kind text,update_title text default '',update_body text default '') returns void language plpgsql security definer set search_path='' as $$
declare row public.campaigns;
begin
 select * into row from public.campaigns where id=campaign_id for update;
 if auth.uid() is null or not found or row.owner_id<>auth.uid() then raise exception 'Not permitted';end if;
 if request_kind='remove' then update public.campaigns set status='removal_requested',featured=false,updated_at=now() where id=campaign_id;
 elsif request_kind='update' and row.status='published' and length(update_title) between 1 and 160 and length(update_body) between 1 and 5000 then
 if (select count(*) from public.campaign_updates u where u.campaign_id=organizer_request.campaign_id and u.status='pending')>=5 then raise exception 'Too many pending updates';end if;
 insert into public.campaign_updates(campaign_id,title,body) values(campaign_id,update_title,update_body);
 else raise exception 'Invalid request';end if;
 insert into public.review_events(campaign_id,actor_id,action) values(campaign_id,auth.uid(),request_kind);
end $$;
create function public.moderate_campaign(record_id uuid,record_kind text,decision text,review_note text default '',links_checked boolean default false,organization_checked boolean default false) returns void language plpgsql security definer set search_path='' as $$
declare cid uuid; revision public.campaign_revisions; owner_contact text;
begin
 if auth.uid() is null or not public.is_fivonine_admin() then raise exception 'Admin required';end if;
 if record_kind='revision' then
 select * into revision from public.campaign_revisions where id=record_id and status='pending' for update;
 if not found then raise exception 'Already reviewed';end if;cid:=revision.campaign_id;
 perform 1 from public.campaigns where id=cid for update;
 if (select status from public.campaigns where id=cid) in('suspended','archived','removal_requested') and decision='approve' then raise exception 'Campaign unavailable';end if;
 if decision not in('approve','decline','changes') then raise exception 'Invalid decision';end if;
 update public.campaign_revisions set status=case decision when 'approve' then 'approved' when 'decline' then 'declined' else 'needs_changes' end,reviewed_at=now(),review_note=moderate_campaign.review_note where id=record_id;
 if decision='approve' then update public.campaigns set public_content=revision.content,status='published',contact_confirmed=true,links_checked_at=case when links_checked then now() else null end,organization_reviewed_at=case when organization_checked then now() else null end,updated_at=now() where id=cid;
 else update public.campaigns set status=case when status='published' then status when decision='decline' then 'declined' else 'needs_changes' end where id=cid;end if;
 elsif record_kind='update' then
 if decision not in('approve','decline') then raise exception 'Invalid decision';end if;
 update public.campaign_updates set status=case when decision='approve' then 'approved' else 'declined' end where id=record_id and status='pending' returning campaign_id into cid;
 if cid is null then raise exception 'Already reviewed';end if;
 elsif record_kind='campaign' then
 cid:=record_id;
 if decision='suspend' then update public.campaigns set status='suspended',featured=false,updated_at=now() where id=cid;
 elsif decision='archive' then update public.campaigns set status='archived',featured=false,updated_at=now() where id=cid;
 elsif decision='feature' then update public.campaigns set featured=true where id=cid and status='published';
 elsif decision='unfeature' then update public.campaigns set featured=false where id=cid;
 else raise exception 'Invalid decision';end if;
 if not found then raise exception 'Campaign unavailable';end if;
 elsif record_kind='report' and decision='resolve' then update public.reports set handled=true where id=record_id returning campaign_id into cid;if not found then raise exception 'Report unavailable';end if;
 elsif record_kind='contact' and decision='resolve' then update public.contact_messages set handled=true where id=record_id;if not found then raise exception 'Message unavailable';end if;
 else raise exception 'Invalid action';end if;
 insert into public.review_events(campaign_id,actor_id,action,note) values(cid,auth.uid(),record_kind||':'||decision,review_note);
 if cid is not null then select p.email into owner_contact from public.organizer_profiles p join public.campaigns c on c.owner_id=p.user_id where c.id=cid;
 insert into public.email_outbox(recipient,subject,body) values(owner_contact,'Pote Kole: campaign review update','Decision: '||decision||E'\n'||review_note||E'\nSign in to view your campaign status.');end if;
end $$;
revoke all on function public.submit_campaign(jsonb,uuid),public.organizer_request(uuid,text,text,text),public.moderate_campaign(uuid,text,text,text,boolean,boolean) from public,anon;
grant execute on function public.submit_campaign(jsonb,uuid),public.organizer_request(uuid,text,text,text),public.moderate_campaign(uuid,text,text,text,boolean,boolean) to authenticated;
create function public.consume_rate_limit(bucket text) returns boolean language plpgsql security invoker set search_path='' as $$
declare n int;
begin insert into public.request_limits as r(bucket) values(bucket) on conflict(bucket) do update set hits=case when r.window_started<now()-interval '1 hour' then 1 else r.hits+1 end,window_started=case when r.window_started<now()-interval '1 hour' then now() else r.window_started end returning hits into n;return n<=5;end $$;
revoke all on function public.consume_rate_limit(text) from public,anon,authenticated;
grant execute on function public.consume_rate_limit(text) to service_role;

create table public.campaign_metrics(campaign_id uuid primary key references public.campaigns on delete cascade,outbound_clicks bigint not null default 0);
alter table public.campaign_metrics enable row level security;
revoke all on public.campaign_metrics from anon,authenticated;
grant select on public.campaign_metrics to authenticated;
grant all on public.campaign_metrics to service_role;
create policy admin_metrics on public.campaign_metrics for select to authenticated using((select public.is_fivonine_admin()));
create function public.record_outbound_click(campaign_id uuid) returns void language sql security invoker set search_path='' as $$ insert into public.campaign_metrics(campaign_id,outbound_clicks) values(campaign_id,1) on conflict(campaign_id) do update set outbound_clicks=campaign_metrics.outbound_clicks+1 $$;
revoke all on function public.record_outbound_click(uuid) from public,anon,authenticated;
grant execute on function public.record_outbound_click(uuid) to service_role;
create function public.claim_email_batch() returns setof public.email_outbox language sql security invoker set search_path='' as $$
 update public.email_outbox as jobs set processing_until=now()+interval '5 minutes',attempts=attempts+1
 where id in(select id from public.email_outbox where sent_at is null and attempts<5 and created_at>now()-interval '23 hours' and (processing_until is null or processing_until<now()) order by created_at for update skip locked limit 10) returning jobs.* $$;
revoke all on function public.claim_email_batch() from public,anon,authenticated;
grant execute on function public.claim_email_batch() to service_role;
