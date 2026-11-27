-- Pre-launch test mode: while the switch is on, fundraisers owned by an administrator skip the identity and recipient checks.
-- Turn it off in Admin > Settings before launch. Fundraisers from other accounts are never affected.
insert into public.settings(key,value) values('prelaunch_test_mode','{"active": true}') on conflict (key) do nothing;
create or replace function private.test_mode_owner(cid uuid) returns boolean
language sql stable security definer set search_path='' as $$
  select coalesce((select value->>'active' from public.settings where key='prelaunch_test_mode'),'false')='true'
    and exists(select 1 from public.campaigns c join public.profiles p on p.id=c.owner_id where c.id=cid and p.role='admin')
$$;
revoke all on function private.test_mode_owner(uuid) from public,anon,authenticated;
grant execute on function private.test_mode_owner(uuid) to anon,authenticated;

create or replace function private.has_campaign_verification(cid uuid) returns boolean
language sql stable security definer set search_path='' as $$
  select private.test_mode_owner(cid) or (private.has_identity_evidence(cid) and exists(
    select 1 from public.campaign_private p join public.campaigns c on c.id=p.campaign_id
    where c.id=cid and p.identity_checked_at is not null and p.identity_checked_by is not null
      and p.recipient_checked_at is not null and p.recipient_checked_by is not null
      and p.identity_checked_by<>c.owner_id and p.recipient_checked_by<>c.owner_id
      and p.identity_evidence_hash=private.identity_fingerprint(p.id_front_path,p.selfie_path,p.contact_name)
      and p.recipient_details_hash=private.recipient_fingerprint(cid)
      and nullif(btrim(c.beneficiary_name),'') is not null and c.beneficiary_relation is not null
      and exists(select 1 from public.support_methods where campaign_id=cid))
)
$$;
create or replace function private.public_campaign_verified(cid uuid) returns boolean
language sql stable security definer set search_path='' as $$
  select (exists(select 1 from public.campaigns where id=cid and status in ('live','completed') and tier<>'none') or (private.test_mode_owner(cid) and exists(select 1 from public.campaigns where id=cid and status in ('live','completed'))))
    and private.has_campaign_verification(cid)
$$;
create or replace function private.require_campaign_verification() returns trigger
language plpgsql security definer set search_path='' as $$
declare p public.campaign_private;
begin
  if new.status='pending' and (tg_op='INSERT' or old.status is distinct from new.status) and not private.test_mode_owner(new.id) and not private.has_identity_evidence(new.id) then
    raise exception 'Private government ID, selfie and consent are required before review';
  end if;
  if new.status in ('live','completed') and ((new.tier='none' and not private.test_mode_owner(new.id)) or not private.has_campaign_verification(new.id)) then
    raise exception 'Identity and recipient details must be checked before publication';
  end if;
  if new.status='live' and tg_op='UPDATE' and old.status not in ('live','completed') then
    select * into p from public.campaign_private where campaign_id=new.id;
    if p.identity_checked_at<transaction_timestamp() or p.recipient_checked_at<transaction_timestamp() then
      raise exception 'Repeat identity and recipient checks before publishing or restoring';
    end if;
  end if;
  return new;
end $$;
create or replace function private.guard_verification() returns trigger
language plpgsql set search_path='' as $$
declare owner_id uuid; evidence_changed boolean; reviewer boolean := private.is_admin();
begin
  select c.owner_id into owner_id from public.campaigns c where c.id=new.campaign_id;
  if tg_op='INSERT' then
    new.identity_checked_at:=null; new.identity_checked_by:=null; new.identity_evidence_hash:=null;
    new.recipient_checked_at:=null; new.recipient_checked_by:=null; new.recipient_details_hash:=null;
    return new;
  end if;
  if current_user in ('anon','authenticated') and not reviewer then
    new.identity_checked_at:=old.identity_checked_at; new.identity_checked_by:=old.identity_checked_by; new.identity_evidence_hash:=old.identity_evidence_hash;
    new.recipient_checked_at:=old.recipient_checked_at; new.recipient_checked_by:=old.recipient_checked_by; new.recipient_details_hash:=old.recipient_details_hash;
  end if;
  evidence_changed := (new.id_front_path,new.selfie_path,new.contact_name) is distinct from (old.id_front_path,old.selfie_path,old.contact_name)
    or (old.consent_at is not null and new.consent_at is null);
  if evidence_changed then
    new.identity_checked_at:=null; new.identity_checked_by:=null; new.identity_evidence_hash:=null;
    new.recipient_checked_at:=null; new.recipient_checked_by:=null; new.recipient_details_hash:=null;
  elsif reviewer then
    if (new.identity_checked_at,new.identity_checked_by) is distinct from (old.identity_checked_at,old.identity_checked_by) and new.identity_checked_at is not null then
      if auth.uid()=owner_id and not private.test_mode_owner(new.campaign_id) then raise exception 'Another administrator must verify your fundraiser'; end if;
      if not private.test_mode_owner(new.campaign_id) and (new.consent_at is null or new.id_front_path=new.selfie_path or nullif(btrim(new.contact_name),'') is null
        or not private.identity_file_exists(owner_id,new.id_front_path) or not private.identity_file_exists(owner_id,new.selfie_path)) then
        raise exception 'Private government ID and selfie images with consent are required';
      end if;
      new.identity_checked_at:=now(); new.identity_checked_by:=auth.uid();
      new.identity_evidence_hash:=private.identity_fingerprint(new.id_front_path,new.selfie_path,new.contact_name);
    end if;
    if (new.recipient_checked_at,new.recipient_checked_by) is distinct from (old.recipient_checked_at,old.recipient_checked_by) and new.recipient_checked_at is not null then
      if auth.uid()=owner_id and not private.test_mode_owner(new.campaign_id) then raise exception 'Another administrator must verify your fundraiser'; end if;
      if not exists(select 1 from public.support_methods where campaign_id=new.campaign_id) then raise exception 'Recipient details are required'; end if;
      new.recipient_checked_at:=now(); new.recipient_checked_by:=auth.uid();
      new.recipient_details_hash:=private.recipient_fingerprint(new.campaign_id);
    end if;
  end if;
  if new.identity_checked_at is null then new.identity_checked_by:=null; new.identity_evidence_hash:=null; end if;
  if new.recipient_checked_at is null then new.recipient_checked_by:=null; new.recipient_details_hash:=null; end if;
  return new;
end $$;
