-- Organizers can confirm that help reported by a supporter arrived; a fundraiser can be closed with a final report.
begin;
alter table public.contributions add column if not exists received_at timestamptz;
alter table public.campaign_updates add column if not exists final boolean not null default false;

create or replace function private.campaign_support_records(cid uuid)
returns table(id uuid, amount numeric, currency text, method text, display_name text, anonymous boolean, message text, created_at timestamptz, received_at timestamptz)
language sql stable security definer set search_path='' as $$
  select k.id,k.amount,k.currency,k.method,k.display_name,k.anonymous,k.message,k.created_at,k.received_at
  from public.contributions k
  where k.campaign_id=cid and not k.hidden and (private.owns_campaign(cid) or private.is_member(cid))
  order by k.created_at desc limit 200
$$;
create or replace function public.campaign_support_records(cid uuid)
returns table(id uuid, amount numeric, currency text, method text, display_name text, anonymous boolean, message text, created_at timestamptz, received_at timestamptz)
language sql stable security invoker set search_path='' as $$ select * from private.campaign_support_records(cid) $$;

create or replace function private.confirm_support(rid uuid, got boolean) returns text
language plpgsql security definer set search_path='' as $$
declare k public.contributions;
begin
  select * into k from public.contributions where id=rid;
  if k.id is null then return 'not_found'; end if;
  if not (private.owns_campaign(k.campaign_id) or private.is_member(k.campaign_id)) then return 'forbidden'; end if;
  if got then
    update public.contributions set received_at=coalesce(received_at,now()) where id=rid;
    if k.received_at is null then
      insert into public.notifications(user_id,kind,campaign_id,payload)
      values(k.user_id,'support_confirmed',k.campaign_id,jsonb_build_object('title',(select title from public.campaigns where id=k.campaign_id)));
    end if;
  else
    update public.contributions set received_at=null where id=rid;
  end if;
  return 'ok';
end $$;
create or replace function public.confirm_support(rid uuid, got boolean) returns text
language sql security invoker set search_path='' as $$ select private.confirm_support(rid, got) $$;

create or replace function private.support_tally(cid uuid)
returns table(reported bigint, confirmed bigint)
language sql stable security definer set search_path='' as $$
  select count(*), count(k.received_at)
  from public.contributions k join public.campaigns c on c.id=k.campaign_id
  where k.campaign_id=cid and not k.hidden and c.status in ('live','completed') and private.public_campaign_verified(c.id)
$$;
create or replace function public.support_tally(cid uuid)
returns table(reported bigint, confirmed bigint)
language sql stable security invoker set search_path='' as $$ select * from private.support_tally(cid) $$;

revoke all on function private.campaign_support_records(uuid),public.campaign_support_records(uuid),private.confirm_support(uuid,boolean),public.confirm_support(uuid,boolean),private.support_tally(uuid),public.support_tally(uuid) from public,anon,authenticated;
grant execute on function private.campaign_support_records(uuid),public.campaign_support_records(uuid),private.confirm_support(uuid,boolean),public.confirm_support(uuid,boolean) to authenticated;
grant execute on function private.support_tally(uuid),public.support_tally(uuid) to anon,authenticated;
commit;
