-- Add the public projection before deploying the application that uses it.
begin;
create or replace function private.public_contribution_notes(cid uuid)
returns table(id uuid,campaign_id uuid,display_name text,anonymous boolean,message text,created_at timestamptz)
language sql stable security definer set search_path='' as $$
  select k.id,k.campaign_id,case when k.anonymous then null else k.display_name end,k.anonymous,k.message,k.created_at
  from public.contributions k join public.campaigns c on c.id=k.campaign_id
  where k.campaign_id=cid and not k.hidden and nullif(btrim(k.message),'') is not null
    and c.status in ('live','completed') and private.public_campaign_verified(c.id)
  order by k.created_at desc limit 30
$$;
create or replace function public.public_contribution_notes(cid uuid)
returns table(id uuid,campaign_id uuid,display_name text,anonymous boolean,message text,created_at timestamptz)
language sql stable security invoker set search_path='' as $$
  select * from private.public_contribution_notes(cid)
$$;
revoke all on function private.public_contribution_notes(uuid),public.public_contribution_notes(uuid) from public,anon,authenticated;
grant execute on function private.public_contribution_notes(uuid),public.public_contribution_notes(uuid) to anon,authenticated;
commit;
