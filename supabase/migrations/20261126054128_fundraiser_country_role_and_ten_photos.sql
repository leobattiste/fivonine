-- New application fields. Nullable for compatibility with existing fundraisers.
alter table public.campaigns add column country_code text check(country_code is null or country_code ~ '^[A-Z]{2}$'),
 add column organization_role text check(organization_role is null or char_length(organization_role)<=120);
alter table public.campaigns drop constraint campaigns_gallery_check;
alter table public.campaigns add constraint campaigns_gallery_check check(cardinality(gallery)<=9);
CREATE OR REPLACE FUNCTION private.guard_campaign()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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
  changed := (new.title,new.story,new.cause,new.department,new.commune,new.country_code,new.organization_role,new.beneficiary_name,new.beneficiary_relation,
              new.goal_amount,new.goal_currency,new.deadline,new.urgent,new.cover_path,new.gallery,new.video_url,new.voice_path,new.language)
    is distinct from
             (old.title,old.story,old.cause,old.department,old.commune,old.country_code,old.organization_role,old.beneficiary_name,old.beneficiary_relation,
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
end $function$;
CREATE OR REPLACE FUNCTION public.apply_campaign_changes(cid uuid, checked_identity boolean, checked_recipient boolean)
 RETURNS text
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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
    department=nullif(r->>'department',''),commune=nullif(r->>'commune',''),
    country_code=case when r ? 'country_code' then nullif(r->>'country_code','') else country_code end,
    organization_role=case when r ? 'organization_role' then nullif(r->>'organization_role','') else organization_role end,
    beneficiary_name=nullif(r->>'beneficiary_name',''),
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
end $function$;
