-- Mandatory identity and recipient review. No private evidence is made public.
begin;

-- Private evidence, explicit reviewer attestations and fail-closed publication.
alter table public.campaign_private
  add column if not exists identity_checked_at timestamptz,
  add column if not exists identity_checked_by uuid references public.profiles(id) on delete set null,
  add column if not exists identity_evidence_hash text,
  add column if not exists recipient_checked_at timestamptz,
  add column if not exists recipient_checked_by uuid references public.profiles(id) on delete set null,
  add column if not exists recipient_details_hash text;

-- These helpers return only booleans/hashes, never private files or account details.
create or replace function private.identity_file_exists(owner_id uuid, file_path text) returns boolean
language sql stable security definer set search_path='' as $$
  select file_path is not null
    and file_path ~ ('^' || owner_id::text || '/[a-z0-9-]{8,60}\.(webp|jpg|jpeg|png)$')
    and exists(select 1 from storage.objects o where o.bucket_id='documents' and o.name=file_path
      and coalesce(to_jsonb(o)->>'owner_id',to_jsonb(o)->>'owner')=owner_id::text
      and coalesce(o.metadata->>'mimetype','') in ('image/webp','image/jpeg','image/png'))
$$;
create or replace function private.identity_fingerprint(front_path text, selfie text, full_name text) returns text
language sql immutable set search_path='' as $$
  select encode(sha256(convert_to(jsonb_build_array(front_path,selfie,full_name)::text,'UTF8')),'hex')
$$;
create or replace function private.recipient_fingerprint(cid uuid) returns text
language sql stable security definer set search_path='' as $$
  select encode(sha256(convert_to(jsonb_build_array(c.beneficiary_name,c.beneficiary_relation,
    (select coalesce(jsonb_agg(jsonb_build_array(m.method,m.details,to_jsonb(m)->>'link') order by m.method),'[]'::jsonb) from public.support_methods m where m.campaign_id=cid))::text,'UTF8')),'hex')
  from public.campaigns c where c.id=cid
$$;
create or replace function private.has_identity_evidence(cid uuid) returns boolean
language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.campaign_private p join public.campaigns c on c.id=p.campaign_id
    where c.id=cid and p.id_front_path<>p.selfie_path and p.consent_at is not null and nullif(btrim(p.contact_name),'') is not null
      and nullif(btrim(p.contact_details),'') is not null and p.contact_email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
      and private.identity_file_exists(c.owner_id,p.id_front_path)
      and private.identity_file_exists(c.owner_id,p.selfie_path))
$$;
create or replace function private.has_campaign_verification(cid uuid) returns boolean
language sql stable security definer set search_path='' as $$
  select private.has_identity_evidence(cid) and exists(
    select 1 from public.campaign_private p join public.campaigns c on c.id=p.campaign_id
    where c.id=cid and p.identity_checked_at is not null and p.identity_checked_by is not null
      and p.recipient_checked_at is not null and p.recipient_checked_by is not null
      and p.identity_checked_by<>c.owner_id and p.recipient_checked_by<>c.owner_id
      and p.identity_evidence_hash=private.identity_fingerprint(p.id_front_path,p.selfie_path,p.contact_name)
      and p.recipient_details_hash=private.recipient_fingerprint(cid)
      and nullif(btrim(c.beneficiary_name),'') is not null and c.beneficiary_relation is not null
      and exists(select 1 from public.support_methods where campaign_id=cid))
$$;
create or replace function private.public_campaign_verified(cid uuid) returns boolean
language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.campaigns where id=cid and status in ('live','completed') and tier<>'none')
    and private.has_campaign_verification(cid)
$$;

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
      if auth.uid()=owner_id then raise exception 'Another administrator must verify your fundraiser'; end if;
      if new.consent_at is null or new.id_front_path=new.selfie_path or nullif(btrim(new.contact_name),'') is null
        or not private.identity_file_exists(owner_id,new.id_front_path) or not private.identity_file_exists(owner_id,new.selfie_path) then
        raise exception 'Private government ID and selfie images with consent are required';
      end if;
      new.identity_checked_at:=now(); new.identity_checked_by:=auth.uid();
      new.identity_evidence_hash:=private.identity_fingerprint(new.id_front_path,new.selfie_path,new.contact_name);
    end if;
    if (new.recipient_checked_at,new.recipient_checked_by) is distinct from (old.recipient_checked_at,old.recipient_checked_by) and new.recipient_checked_at is not null then
      if auth.uid()=owner_id then raise exception 'Another administrator must verify your fundraiser'; end if;
      if not exists(select 1 from public.support_methods where campaign_id=new.campaign_id) then raise exception 'Recipient details are required'; end if;
      new.recipient_checked_at:=now(); new.recipient_checked_by:=auth.uid();
      new.recipient_details_hash:=private.recipient_fingerprint(new.campaign_id);
    end if;
  end if;
  if new.identity_checked_at is null then new.identity_checked_by:=null; new.identity_evidence_hash:=null; end if;
  if new.recipient_checked_at is null then new.recipient_checked_by:=null; new.recipient_details_hash:=null; end if;
  return new;
end $$;
drop trigger if exists guard_verification on public.campaign_private;
create trigger guard_verification before insert or update on public.campaign_private for each row execute function private.guard_verification();

create or replace function private.verification_changed() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if new.identity_checked_at is distinct from old.identity_checked_at or new.identity_evidence_hash is distinct from old.identity_evidence_hash then
    insert into public.audit_log(actor_id,action,target_type,target_id,note)
      values(auth.uid(),case when new.identity_checked_at is null then 'identity_check_revoked' else 'identity_checked' end,'campaign',new.campaign_id::text,new.identity_evidence_hash);
  end if;
  if new.recipient_checked_at is distinct from old.recipient_checked_at or new.recipient_details_hash is distinct from old.recipient_details_hash then
    insert into public.audit_log(actor_id,action,target_type,target_id,note)
      values(auth.uid(),case when new.recipient_checked_at is null then 'recipient_check_revoked' else 'recipient_checked' end,'campaign',new.campaign_id::text,new.recipient_details_hash);
  end if;
  if (new.identity_checked_at is null or new.recipient_checked_at is null)
    and (old.identity_checked_at is not null or old.recipient_checked_at is not null) then
    update public.campaigns set status='needs_changes',tier='none',featured=false
      where id=new.campaign_id and status in ('live','completed');
  end if;
  return null;
end $$;
drop trigger if exists verification_changed on public.campaign_private;
create trigger verification_changed after update on public.campaign_private for each row execute function private.verification_changed();

create or replace function private.invalidate_recipient_check() returns trigger
language plpgsql security definer set search_path='' as $$
declare cid uuid;
begin
  cid := case when tg_op='DELETE' then old.campaign_id else new.campaign_id end;
  update public.campaign_private set recipient_checked_at=null,recipient_checked_by=null,recipient_details_hash=null
    where campaign_id=cid and recipient_checked_at is not null;
  return null;
end $$;
drop trigger if exists invalidate_recipient_check on public.support_methods;
create trigger invalidate_recipient_check after insert or update or delete on public.support_methods for each row execute function private.invalidate_recipient_check();

create or replace function private.invalidate_beneficiary_check() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if (new.beneficiary_name,new.beneficiary_relation) is distinct from (old.beneficiary_name,old.beneficiary_relation) then
    update public.campaign_private set recipient_checked_at=null,recipient_checked_by=null,recipient_details_hash=null
      where campaign_id=new.id and recipient_checked_at is not null;
  end if;
  return null;
end $$;
drop trigger if exists invalidate_beneficiary_check on public.campaigns;
create trigger invalidate_beneficiary_check after update on public.campaigns for each row execute function private.invalidate_beneficiary_check();

create or replace function private.require_campaign_verification() returns trigger
language plpgsql security definer set search_path='' as $$
declare p public.campaign_private;
begin
  if new.status='pending' and (tg_op='INSERT' or old.status is distinct from new.status) and not private.has_identity_evidence(new.id) then
    raise exception 'Private government ID, selfie and consent are required before review';
  end if;
  if new.status in ('live','completed') and (new.tier='none' or not private.has_campaign_verification(new.id)) then
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
drop trigger if exists zz_require_campaign_verification on public.campaigns;
create trigger zz_require_campaign_verification before insert or update on public.campaigns for each row execute function private.require_campaign_verification();

-- Public reads fail closed even for legacy public rows without verification records.
drop policy if exists campaigns_public on public.campaigns;
create policy campaigns_public on public.campaigns for select to anon
  using (status in ('live','completed') and private.public_campaign_verified(id));
drop policy if exists campaigns_member on public.campaigns;
create policy campaigns_member on public.campaigns for select to authenticated
  using ((status in ('live','completed') and private.public_campaign_verified(id)) or owner_id=(select auth.uid()) or (select private.is_admin()) or private.is_member(id));

-- Owners may remove unused uploads, but cannot remove evidence behind a public claim.
create or replace function private.protect_public_identity_files() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if old.bucket_id='documents' and exists(select 1 from public.campaign_private p join public.campaigns c on c.id=p.campaign_id
    where c.status in ('live','completed') and old.name in (p.id_front_path,p.selfie_path)) then
    raise exception 'Close the fundraiser before removing its verification evidence';
  end if;
  return old;
end $$;
drop trigger if exists protect_public_identity_files on storage.objects;
create trigger protect_public_identity_files before delete on storage.objects for each row execute function private.protect_public_identity_files();

-- Attestations and the publishing decision commit together, with their audit records.
create or replace function public.review_campaign(cid uuid, decision text, review_note text, checked_identity boolean, checked_recipient boolean, badge text, flags jsonb) returns text
language plpgsql security invoker set search_path='' as $$
declare c public.campaigns; target_status text;
begin
  if not private.is_admin() then raise exception 'Admin access required'; end if;
  select * into c from public.campaigns where id=cid for update;
  if not found then raise exception 'Fundraiser not found'; end if;
  target_status := case decision when 'approve' then 'live' when 'restore' then 'live' when 'needs_changes' then 'needs_changes' when 'reject' then 'rejected' when 'suspend' then 'suspended' when 'flags' then c.status else null end;
  if target_status is null then raise exception 'Choose a decision'; end if;
  if decision in ('needs_changes','reject','suspend') and char_length(btrim(coalesce(review_note,'')))<5 then raise exception 'Write a reason for the organizer'; end if;
  if decision='approve' and c.status<>'pending' then raise exception 'Only a submitted fundraiser can be approved'; end if;
  if decision='restore' and c.status<>'suspended' then raise exception 'This fundraiser is not suspended'; end if;
  if decision in ('approve','restore') and (badge='none' or checked_identity is not true or checked_recipient is not true) then raise exception 'Confirm the identity and recipient checks before publishing'; end if;
  if badge not in ('none','id_checked','community','organization') then raise exception 'Choose a verification badge'; end if;
  insert into public.campaign_private(campaign_id) values(cid) on conflict (campaign_id) do nothing;
  update public.campaign_private set
    review_note=case when decision='flags' then public.campaign_private.review_note else nullif(left(btrim(review_campaign.review_note),2000),'') end,
    identity_checked_at=case when decision in ('approve','restore') then clock_timestamp() else identity_checked_at end,
    recipient_checked_at=case when decision in ('approve','restore') then clock_timestamp() else recipient_checked_at end
    where campaign_id=cid;
  update public.campaigns set status=target_status,tier=badge,
    featured=coalesce((flags->>'featured')::boolean,false),urgent=coalesce((flags->>'urgent')::boolean,false),emergency=coalesce((flags->>'emergency')::boolean,false)
    where id=cid;
  insert into public.audit_log(actor_id,action,target_type,target_id,note) values(auth.uid(),'campaign_'||decision,'campaign',cid::text,nullif(left(review_note,2000),''));
  return 'ok';
end $$;

-- A locked proposed payload is checked and published atomically; the old public version stays intact until then.
drop function if exists public.apply_campaign_changes(uuid);
create or replace function public.apply_campaign_changes(cid uuid, checked_identity boolean, checked_recipient boolean) returns text
language plpgsql security invoker set search_path='' as $$
declare ch record; r jsonb; m jsonb; i int:=0; c public.campaigns; payload_hash text;
begin
  if not private.is_admin() then raise exception 'Admin access required'; end if;
  if checked_identity is not true or checked_recipient is not true then raise exception 'Confirm identity and the proposed recipient details before publishing'; end if;
  select * into c from public.campaigns where id=cid for update;
  if not found or c.status<>'live' then raise exception 'Only a public fundraiser can publish proposed changes'; end if;
  if c.owner_id=auth.uid() then raise exception 'Another administrator must review your fundraiser'; end if;
  select * into ch from public.campaign_changes where campaign_id=cid for update;
  if not found or ch.status<>'pending' then raise exception 'These changes are no longer waiting'; end if;
  r:=ch.payload->'row';
  payload_hash:=encode(sha256(convert_to(ch.payload::text,'UTF8')),'hex');
  update public.campaigns set title=coalesce(r->>'title',title),story=coalesce(r->>'story',story),cause=nullif(r->>'cause',''),
    department=nullif(r->>'department',''),commune=nullif(r->>'commune',''),beneficiary_name=nullif(r->>'beneficiary_name',''),
    beneficiary_relation=nullif(r->>'beneficiary_relation',''),goal_amount=nullif(r->>'goal_amount','')::numeric,
    goal_currency=coalesce(r->>'goal_currency',goal_currency),deadline=nullif(r->>'deadline','')::date,
    urgent=coalesce((r->>'urgent')::boolean,urgent),cover_path=nullif(r->>'cover_path',''),
    gallery=coalesce(array(select jsonb_array_elements_text(r->'gallery')),'{}'),video_url=nullif(r->>'video_url',''),
    voice_path=nullif(r->>'voice_path',''),language=coalesce(r->>'language',language)
    where id=cid;
  if ch.payload ? 'methods' then
    delete from public.support_methods where campaign_id=cid;
    for m in select * from jsonb_array_elements(ch.payload->'methods') loop
      insert into public.support_methods(campaign_id,method,details,link,position) values(cid,m->>'method',m->>'details',nullif(m->>'link',''),i);
      i:=i+1;
    end loop;
  end if;
  update public.campaign_private set identity_checked_at=clock_timestamp(),recipient_checked_at=clock_timestamp() where campaign_id=cid;
  update public.campaigns set status='live',tier=c.tier where id=cid;
  delete from public.campaign_changes where campaign_id=cid;
  insert into public.audit_log(actor_id,action,target_type,target_id,note) values(auth.uid(),'changes_approve','campaign',cid::text,'Reviewed proposed payload SHA256 '||payload_hash);
  perform private.notify(c.owner_id,'changes_approved',cid,jsonb_build_object('title',coalesce(r->>'title',c.title),'slug',c.slug));
  return 'ok';
end $$;

-- Restriction, suspension, undo and discard operations are atomic and reject missing rows.
create or replace function public.apply_campaign_changes(cid uuid) returns text
language plpgsql security invoker set search_path='' as $$
begin
  raise exception 'Refresh the review page and confirm identity and recipient checks before publishing';
end $$;

create or replace function public.suspend_campaigns(ids uuid[], reason text) returns int
language plpgsql security invoker set search_path='' as $$
declare cid uuid; n int:=0;
begin
  if not private.is_admin() then raise exception 'Admin access required'; end if;
  if char_length(btrim(coalesce(reason,'')))<5 then raise exception 'Write a reason for the organizer'; end if;
  for cid in select id from public.campaigns where id=any(ids) and status in ('live','pending','needs_changes') for update loop
    insert into public.campaign_private(campaign_id,review_note) values(cid,left(reason,2000))
      on conflict (campaign_id) do update set review_note=excluded.review_note;
    update public.campaigns set status='suspended' where id=cid;
    insert into public.audit_log(actor_id,action,target_type,target_id,note) values(auth.uid(),'campaign_suspend','campaign',cid::text,left(reason,2000));
    n:=n+1;
  end loop;
  if n<>cardinality(ids) then raise exception 'Some fundraisers are missing or can no longer be suspended'; end if;
  return n;
end $$;
create or replace function public.set_account_restriction(uid uuid, restricted boolean, reason text) returns text
language plpgsql security invoker set search_path='' as $$
declare ids uuid[];
begin
  if not private.is_admin() or uid=auth.uid() then raise exception 'Admin access required for another account'; end if;
  perform 1 from public.profiles where id=uid for update;
  if not found then raise exception 'User not found'; end if;
  update public.profiles set banned=restricted where id=uid;
  if restricted then
    select array_agg(id) into ids from public.campaigns where owner_id=uid and status in ('live','pending','needs_changes');
    if cardinality(ids)>0 then perform public.suspend_campaigns(ids,coalesce(nullif(btrim(reason),''),'Account restricted by an administrator.')); end if;
  end if;
  insert into public.audit_log(actor_id,action,target_type,target_id,note) values(auth.uid(),case when restricted then 'user_ban' else 'user_unban' end,'user',uid::text,nullif(left(reason,2000),''));
  return 'ok';
end $$;
create or replace function public.undo_campaign_flags(snapshot jsonb) returns text
language plpgsql security invoker set search_path='' as $$
declare r jsonb; c public.campaigns;
begin
  if not private.is_admin() then raise exception 'Admin access required'; end if;
  if jsonb_typeof(snapshot)<>'array' or jsonb_array_length(snapshot)=0 or jsonb_array_length(snapshot)>100 then raise exception 'Nothing to undo'; end if;
  for r in select * from jsonb_array_elements(snapshot) loop
    select * into c from public.campaigns where id=(r->>'id')::uuid for update;
    if not found then raise exception 'A fundraiser no longer exists'; end if;
    if r->>'status' in ('live','completed') and c.status not in ('live','completed') then raise exception 'Restore suspended fundraisers individually and repeat verification checks'; end if;
    update public.campaigns set status=r->>'status',featured=(r->>'featured')::boolean where id=c.id;
  end loop;
  return 'ok';
end $$;
create or replace function public.discard_campaign_changes(cid uuid, reason text) returns text
language plpgsql security invoker set search_path='' as $$
declare c public.campaigns;
begin
  if not private.is_admin() then raise exception 'Admin access required'; end if;
  if char_length(btrim(coalesce(reason,'')))<5 then raise exception 'Write a reason for the organizer'; end if;
  select * into c from public.campaigns where id=cid for update;
  if not found then raise exception 'Fundraiser not found'; end if;
  perform 1 from public.campaign_changes where campaign_id=cid for update;
  if not found then raise exception 'These changes are no longer waiting'; end if;
  update public.campaign_private set review_note=left(reason,2000) where campaign_id=cid;
  delete from public.campaign_changes where campaign_id=cid;
  insert into public.audit_log(actor_id,action,target_type,target_id,note) values(auth.uid(),'changes_discard','campaign',cid::text,left(reason,2000));
  perform private.notify(c.owner_id,'changes_needed',cid,jsonb_build_object('title',c.title,'slug',c.slug,'note',left(reason,2000)));
  return 'ok';
end $$;

-- Appeal decisions are delivered to the member, never just recorded in the staff UI.
create or replace function private.appeal_decision_notify() returns trigger
language plpgsql security definer set search_path='' as $$
declare ttl text;
begin
  if new.status is distinct from old.status and new.status in ('accepted','declined') then
    if not private.is_admin() then raise exception 'Admin access required'; end if;
    if old.status<>'open' then raise exception 'This appeal already has a decision'; end if;
    if char_length(btrim(coalesce(new.admin_note,'')))<5 then raise exception 'Write a reply for the member'; end if;
    select title into ttl from public.campaigns where id=new.campaign_id;
    perform private.notify(new.user_id,'appeal_'||new.status,new.campaign_id,jsonb_build_object('title',coalesce(ttl,''),'note',new.admin_note));
    insert into public.audit_log(actor_id,action,target_type,target_id,note) values(auth.uid(),'appeal_'||new.status,'appeal',new.id::text,new.admin_note);
  end if;
  return null;
end $$;
drop trigger if exists appeal_decision_notify on public.appeals;
create trigger appeal_decision_notify after update on public.appeals for each row execute function private.appeal_decision_notify();

create or replace function private.appeal_submitted_notify() returns trigger
language plpgsql security definer set search_path='' as $$
declare reviewer record; ttl text;
begin
  select title into ttl from public.campaigns where id=new.campaign_id;
  for reviewer in select id from public.profiles where role='admin' and not banned loop
    perform private.notify(reviewer.id,'admin_appeal',new.campaign_id,jsonb_build_object('title',coalesce(ttl,'')));
  end loop;
  return null;
end $$;
drop trigger if exists appeal_submitted_notify on public.appeals;
create trigger appeal_submitted_notify after insert on public.appeals for each row execute function private.appeal_submitted_notify();

create or replace function private.report_email_notify() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  insert into public.email_outbox(recipient,locale,kind,payload)
    select u.email,p.locale,'admin_report',jsonb_build_object('title',c.title,'slug',c.slug)
    from public.profiles p join auth.users u on u.id=p.id cross join public.campaigns c
    where p.role='admin' and not p.banned and p.email_notifications and u.email is not null and c.id=new.campaign_id;
  return null;
end $$;
drop trigger if exists report_email_notify on public.reports;
create trigger report_email_notify after insert on public.reports for each row execute function private.report_email_notify();

revoke all on function private.identity_file_exists(uuid,text),private.identity_fingerprint(text,text,text),private.recipient_fingerprint(uuid),private.has_identity_evidence(uuid),private.has_campaign_verification(uuid),private.public_campaign_verified(uuid),private.guard_verification(),private.verification_changed(),private.invalidate_recipient_check(),private.invalidate_beneficiary_check(),private.require_campaign_verification(),private.protect_public_identity_files(),private.appeal_decision_notify() from public,anon,authenticated;
-- Reviewer checks run as the authenticated admin under RLS; only these non-data helpers are callable.
grant execute on function private.identity_file_exists(uuid,text),private.identity_fingerprint(text,text,text),private.recipient_fingerprint(uuid) to authenticated;
grant execute on function private.public_campaign_verified(uuid) to anon,authenticated;
revoke all on function public.review_campaign(uuid,text,text,boolean,boolean,text,jsonb),public.apply_campaign_changes(uuid,boolean,boolean),public.suspend_campaigns(uuid[],text),public.set_account_restriction(uuid,boolean,text),public.undo_campaign_flags(jsonb),public.discard_campaign_changes(uuid,text) from public,anon,authenticated;
grant execute on function public.review_campaign(uuid,text,text,boolean,boolean,text,jsonb),public.apply_campaign_changes(uuid,boolean,boolean),public.suspend_campaigns(uuid[],text),public.set_account_restriction(uuid,boolean,text),public.undo_campaign_flags(jsonb),public.discard_campaign_changes(uuid,text) to authenticated;
revoke all on function public.apply_campaign_changes(uuid),private.appeal_submitted_notify(),private.report_email_notify() from public,anon,authenticated;
grant execute on function public.apply_campaign_changes(uuid) to authenticated;

-- The only currently public row is a known internal test. Do not fabricate verification or delete it.
with unpublished as (
  update public.campaigns set status='draft',featured=false
  where id='5407b338-719b-4fa3-9f0f-2d9a697c4681' and slug='mksksksk-jtzj'
    and status='live' and not private.has_campaign_verification(id)
  returning id
)
insert into public.audit_log(actor_id,action,target_type,target_id,note)
select null,'launch_test_unpublished','campaign',id::text,'Internal test returned to draft: mandatory identity verification is incomplete.' from unpublished;

commit;
