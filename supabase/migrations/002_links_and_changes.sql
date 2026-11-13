-- yon kout men: optional external links on support methods, and proposed changes that are
-- reviewed while the published fundraiser stays public.

alter table public.support_methods add column if not exists link text
  check (link is null or (link ~ '^https://[^\s]+$' and char_length(link) <= 300));

create table if not exists public.campaign_changes (
  campaign_id uuid primary key references public.campaigns(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  payload jsonb not null,
  status text not null default 'pending' check (status in ('pending','needs_changes')),
  review_note text check (char_length(review_note) <= 2000),
  submitted_at timestamptz not null default now()
);
create index if not exists campaign_changes_author_idx on public.campaign_changes (author_id);
alter table public.campaign_changes enable row level security;

drop policy if exists changes_read on public.campaign_changes;
drop policy if exists changes_write on public.campaign_changes;
drop policy if exists changes_update on public.campaign_changes;
drop policy if exists changes_delete on public.campaign_changes;
create policy changes_read on public.campaign_changes for select to authenticated
  using (private.owns_campaign(campaign_id) or (select private.is_admin()));
create policy changes_write on public.campaign_changes for insert to authenticated
  with check (private.owns_campaign(campaign_id) and author_id=(select auth.uid()) and (select private.can_act()));
create policy changes_update on public.campaign_changes for update to authenticated
  using (private.owns_campaign(campaign_id) or (select private.is_admin()))
  with check (private.owns_campaign(campaign_id) or (select private.is_admin()));
create policy changes_delete on public.campaign_changes for delete to authenticated
  using (private.owns_campaign(campaign_id) or (select private.is_admin()));

-- Owners can't approve their own changes or write a review note.
create or replace function private.guard_changes() returns trigger language plpgsql set search_path='' as $$
begin
  if private.trusted() then return new; end if;
  new.status:='pending'; new.review_note:=null; new.submitted_at:=now(); new.author_id:=(select auth.uid());
  if not exists(select 1 from public.campaigns where id=new.campaign_id and status='live') then
    raise exception 'Only a public fundraiser can have proposed changes';
  end if;
  return new;
end $$;
drop trigger if exists guard_changes on public.campaign_changes;
create trigger guard_changes before insert or update on public.campaign_changes for each row execute function private.guard_changes();

create or replace function private.changes_notify() returns trigger language plpgsql security definer set search_path='' as $$
declare a record; c record;
begin
  select title,slug,owner_id into c from public.campaigns where id=new.campaign_id;
  if new.status='pending' then
    for a in select id from public.profiles where role='admin' and not banned loop
      perform private.notify(a.id,'admin_changes',new.campaign_id,jsonb_build_object('title',c.title,'slug',c.slug));
    end loop;
  elsif new.status='needs_changes' and tg_op='UPDATE' and old.status is distinct from new.status then
    perform private.notify(c.owner_id,'changes_needed',new.campaign_id,jsonb_build_object('title',c.title,'slug',c.slug,'note',coalesce(new.review_note,'')));
  end if;
  return null;
end $$;
drop trigger if exists changes_notify on public.campaign_changes;
create trigger changes_notify after insert or update on public.campaign_changes for each row execute function private.changes_notify();

-- Admin applies proposed changes to the published fundraiser in one transaction.
create or replace function public.apply_campaign_changes(cid uuid) returns text
language plpgsql security invoker set search_path='' as $$
declare ch record; r jsonb; m jsonb; i int := 0; owner uuid; ttl text; sl text;
begin
  if not private.is_admin() then return 'forbidden'; end if;
  select * into ch from public.campaign_changes where campaign_id=cid;
  if not found then return 'none'; end if;
  r := ch.payload->'row';
  update public.campaigns set
    title=coalesce(r->>'title',title), story=coalesce(r->>'story',story), cause=nullif(r->>'cause',''),
    department=nullif(r->>'department',''), commune=nullif(r->>'commune',''), beneficiary_name=nullif(r->>'beneficiary_name',''),
    beneficiary_relation=nullif(r->>'beneficiary_relation',''), goal_amount=nullif(r->>'goal_amount','')::numeric,
    goal_currency=coalesce(r->>'goal_currency',goal_currency), deadline=nullif(r->>'deadline','')::date,
    urgent=coalesce((r->>'urgent')::boolean,urgent), cover_path=nullif(r->>'cover_path',''),
    gallery=coalesce(array(select jsonb_array_elements_text(r->'gallery')),'{}'), video_url=nullif(r->>'video_url',''),
    voice_path=nullif(r->>'voice_path',''), language=coalesce(r->>'language',language), updated_at=now()
  where id=cid returning owner_id,title,slug into owner,ttl,sl;
  if ch.payload ? 'methods' then
    delete from public.support_methods where campaign_id=cid;
    for m in select * from jsonb_array_elements(ch.payload->'methods') loop
      insert into public.support_methods(campaign_id,method,details,link,position)
        values (cid, m->>'method', m->>'details', nullif(m->>'link',''), i);
      i := i + 1;
    end loop;
  end if;
  delete from public.campaign_changes where campaign_id=cid;
  perform private.notify(owner,'changes_approved',cid,jsonb_build_object('title',ttl,'slug',sl));
  return 'ok';
end $$;
revoke all on function public.apply_campaign_changes(uuid) from public, anon;
grant execute on function public.apply_campaign_changes(uuid) to authenticated;
grant select, insert, update, delete on public.campaign_changes to authenticated;
