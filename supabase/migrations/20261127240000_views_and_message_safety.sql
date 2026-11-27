-- Visit and share counts for organizers; message notifications also send email; organizers can block a conversation.
begin;
create table if not exists public.campaign_stats (
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  day date not null default current_date,
  views int not null default 0,
  shares int not null default 0,
  primary key (campaign_id, day)
);
alter table public.campaign_stats enable row level security;
revoke all on public.campaign_stats from public, anon, authenticated;

-- Counts only for public fundraisers; the owner and team never inflate their own counts.
create or replace function private.record_stat(cid uuid, k text) returns void
language plpgsql security definer set search_path='' as $$
begin
  if k not in ('view','share') then return; end if;
  if not exists(select 1 from public.campaigns where id=cid and status in ('live','completed')) then return; end if;
  if (select auth.uid()) is not null and (private.owns_campaign(cid) or private.is_member(cid)) then return; end if;
  insert into public.campaign_stats(campaign_id, day, views, shares)
    values (cid, current_date, (k='view')::int, (k='share')::int)
  on conflict (campaign_id, day) do update
    set views = public.campaign_stats.views + (k='view')::int, shares = public.campaign_stats.shares + (k='share')::int;
end $$;
create or replace function public.record_stat(cid uuid, k text) returns void
language sql security invoker set search_path='' as $$ select private.record_stat(cid, k) $$;

create or replace function private.campaign_stat_totals(cid uuid)
returns table(views bigint, shares bigint, views_week bigint)
language sql stable security definer set search_path='' as $$
  select coalesce(sum(s.views),0), coalesce(sum(s.shares),0), coalesce(sum(s.views) filter (where s.day > current_date - 7),0)
  from public.campaign_stats s
  where s.campaign_id=cid and (private.owns_campaign(cid) or private.is_member(cid) or private.is_admin())
$$;
create or replace function public.campaign_stat_totals(cid uuid)
returns table(views bigint, shares bigint, views_week bigint)
language sql stable security invoker set search_path='' as $$ select * from private.campaign_stat_totals(cid) $$;

create table if not exists public.message_blocks (
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  supporter_id uuid not null references public.profiles(id) on delete cascade,
  blocked_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (campaign_id, supporter_id)
);
alter table public.message_blocks enable row level security;
revoke all on public.message_blocks from public, anon, authenticated;

create or replace function private.block_thread(cid uuid, sid uuid, on_off boolean) returns text
language plpgsql security definer set search_path='' as $$
begin
  if not (private.owns_campaign(cid) or private.is_member(cid)) then return 'forbidden'; end if;
  if on_off then
    insert into public.message_blocks(campaign_id, supporter_id, blocked_by) values (cid, sid, (select auth.uid())) on conflict do nothing;
  else
    delete from public.message_blocks where campaign_id=cid and supporter_id=sid;
  end if;
  return 'ok';
end $$;
create or replace function public.block_thread(cid uuid, sid uuid, on_off boolean) returns text
language sql security invoker set search_path='' as $$ select private.block_thread(cid, sid, on_off) $$;

create or replace function private.thread_blocked(cid uuid, sid uuid) returns boolean
language sql stable security definer set search_path='' as $$
  select private.in_thread(cid, sid) and exists(select 1 from public.message_blocks where campaign_id=cid and supporter_id=sid) $$;
create or replace function public.thread_blocked(cid uuid, sid uuid) returns boolean
language sql stable security invoker set search_path='' as $$ select private.thread_blocked(cid, sid) $$;

create or replace function private.send_message(cid uuid, sid uuid, msg text) returns text
language plpgsql security definer set search_path='' as $$
declare me uuid := (select auth.uid()); c public.campaigns; b text := btrim(coalesce(msg,'')); target uuid;
begin
  if me is null or not private.can_act() then return 'forbidden'; end if;
  if char_length(b) < 1 or char_length(b) > 1500 then return 'invalid'; end if;
  select * into c from public.campaigns where id=cid;
  if c.id is null then return 'not_found'; end if;
  if exists(select 1 from public.message_blocks where campaign_id=cid and supporter_id=sid) then return 'blocked'; end if;
  if (select count(*) from public.messages where sender_id=me and created_at > now() - interval '1 hour') >= 20 then return 'rate'; end if;
  if private.owns_campaign(cid) or private.is_member(cid) then
    if not exists(select 1 from public.messages where campaign_id=cid and supporter_id=sid) then return 'forbidden'; end if;
    target := sid;
  else
    if sid <> me or c.status not in ('live','completed') or not private.public_campaign_verified(cid) then return 'forbidden'; end if;
    target := c.owner_id;
  end if;
  insert into public.messages(campaign_id,supporter_id,sender_id,body) values(cid,sid,me,b);
  -- One notification (and email) per unread burst: skip if the recipient already has an unread one for this thread.
  if not exists(select 1 from public.notifications n where n.user_id=target and n.kind='message' and n.campaign_id=cid
                and n.read_at is null and n.payload->>'with'=sid::text) then
    perform private.notify(target,'message',cid,jsonb_build_object('title',c.title,'slug',c.slug,'with',sid));
  end if;
  return 'ok';
end $$;

revoke all on function private.record_stat(uuid,text),public.record_stat(uuid,text),private.campaign_stat_totals(uuid),public.campaign_stat_totals(uuid),private.block_thread(uuid,uuid,boolean),public.block_thread(uuid,uuid,boolean),private.thread_blocked(uuid,uuid),public.thread_blocked(uuid,uuid) from public,anon,authenticated;
grant execute on function private.record_stat(uuid,text),public.record_stat(uuid,text) to anon,authenticated;
grant execute on function private.campaign_stat_totals(uuid),public.campaign_stat_totals(uuid),private.block_thread(uuid,uuid,boolean),public.block_thread(uuid,uuid,boolean),private.thread_blocked(uuid,uuid),public.thread_blocked(uuid,uuid) to authenticated;
commit;
