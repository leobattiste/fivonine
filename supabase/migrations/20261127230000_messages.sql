-- Private messages between a supporter and the organizers of a fundraiser. One thread per (fundraiser, supporter).
-- The table has no direct access: everything goes through the functions below.
begin;
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  supporter_id uuid not null references public.profiles(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1500),
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists messages_thread_idx on public.messages (campaign_id, supporter_id, created_at);
create index if not exists messages_sender_idx on public.messages (sender_id, created_at desc);
alter table public.messages enable row level security;
revoke all on public.messages from public, anon, authenticated;

create or replace function private.in_thread(cid uuid, sid uuid) returns boolean
language sql stable security definer set search_path='' as $$
  select sid=(select auth.uid()) or private.owns_campaign(cid) or private.is_member(cid) $$;

create or replace function private.send_message(cid uuid, sid uuid, msg text) returns text
language plpgsql security definer set search_path='' as $$
declare me uuid := (select auth.uid()); c public.campaigns; b text := btrim(coalesce(msg,'')); target uuid;
begin
  if me is null or not private.can_act() then return 'forbidden'; end if;
  if char_length(b) < 1 or char_length(b) > 1500 then return 'invalid'; end if;
  select * into c from public.campaigns where id=cid;
  if c.id is null then return 'not_found'; end if;
  if (select count(*) from public.messages where sender_id=me and created_at > now() - interval '1 hour') >= 20 then return 'rate'; end if;
  if private.owns_campaign(cid) or private.is_member(cid) then
    if not exists(select 1 from public.messages where campaign_id=cid and supporter_id=sid) then return 'forbidden'; end if;
    target := sid;
  else
    if sid <> me or c.status not in ('live','completed') or not private.public_campaign_verified(cid) then return 'forbidden'; end if;
    target := c.owner_id;
  end if;
  insert into public.messages(campaign_id,supporter_id,sender_id,body) values(cid,sid,me,b);
  insert into public.notifications(user_id,kind,campaign_id,payload)
    values(target,'message',cid,jsonb_build_object('title',c.title,'slug',c.slug,'with',sid));
  return 'ok';
end $$;
create or replace function public.send_message(cid uuid, sid uuid, msg text) returns text
language sql security invoker set search_path='' as $$ select private.send_message(cid,sid,msg) $$;

create or replace function private.my_threads()
returns table(campaign_id uuid, supporter_id uuid, title text, slug text, other_name text, last_body text, last_at timestamptz, unread bigint, as_organizer boolean)
language sql stable security definer set search_path='' as $$
  with t as (
    select m.campaign_id, m.supporter_id, max(m.created_at) last_at,
           count(*) filter (where m.read_at is null and m.sender_id <> (select auth.uid())) unread
    from public.messages m
    where m.supporter_id=(select auth.uid()) or private.owns_campaign(m.campaign_id) or private.is_member(m.campaign_id)
    group by 1,2)
  select t.campaign_id, t.supporter_id, c.title, c.slug,
         case when t.supporter_id=(select auth.uid()) then (select display_name from public.profiles where id=c.owner_id)
              else (select display_name from public.profiles where id=t.supporter_id) end,
         (select body from public.messages m where m.campaign_id=t.campaign_id and m.supporter_id=t.supporter_id order by m.created_at desc limit 1),
         t.last_at, t.unread, t.supporter_id <> (select auth.uid())
  from t join public.campaigns c on c.id=t.campaign_id
  order by t.last_at desc limit 100
$$;
create or replace function public.my_threads()
returns table(campaign_id uuid, supporter_id uuid, title text, slug text, other_name text, last_body text, last_at timestamptz, unread bigint, as_organizer boolean)
language sql stable security invoker set search_path='' as $$ select * from private.my_threads() $$;

-- Reading a thread also marks the other side's messages as read.
create or replace function private.read_thread(cid uuid, sid uuid)
returns table(id uuid, body text, created_at timestamptz, mine boolean, sender_name text)
language plpgsql security definer set search_path='' as $$
declare me uuid := (select auth.uid());
begin
  if me is null or not private.in_thread(cid,sid) then return; end if;
  update public.messages set read_at=now() where campaign_id=cid and supporter_id=sid and sender_id<>me and read_at is null;
  return query select m.id, m.body, m.created_at, m.sender_id=me, p.display_name
    from public.messages m join public.profiles p on p.id=m.sender_id
    where m.campaign_id=cid and m.supporter_id=sid order by m.created_at asc limit 300;
end $$;
create or replace function public.read_thread(cid uuid, sid uuid)
returns table(id uuid, body text, created_at timestamptz, mine boolean, sender_name text)
language sql security invoker set search_path='' as $$ select * from private.read_thread(cid,sid) $$;

revoke all on function private.in_thread(uuid,uuid),private.send_message(uuid,uuid,text),public.send_message(uuid,uuid,text),private.my_threads(),public.my_threads(),private.read_thread(uuid,uuid),public.read_thread(uuid,uuid) from public,anon,authenticated;
grant execute on function private.in_thread(uuid,uuid),private.send_message(uuid,uuid,text),public.send_message(uuid,uuid,text),private.my_threads(),public.my_threads(),private.read_thread(uuid,uuid),public.read_thread(uuid,uuid) to authenticated;
commit;
