-- Drafts are saved to the account from the first answer, before a title exists.
-- A title (4-120 characters) is still required for anything beyond a private draft.
alter table public.campaigns drop constraint campaigns_title_check;
alter table public.campaigns add constraint campaigns_title_check
  check (char_length(title) <= 120 and (status = 'draft' or char_length(title) >= 4));

-- While a fundraiser is still a private draft, its slug may follow the title. Once submitted, the slug is fixed.
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
  new.id:=old.id; new.owner_id:=old.owner_id; new.featured:=old.featured; new.tier:=old.tier;
  if old.status<>'draft' then new.slug:=old.slug; end if;
  new.emergency:=old.emergency; new.created_at:=old.created_at; new.published_at:=old.published_at;
  new.submitted_at:=old.submitted_at;
  changed := (new.title,new.story,new.cause,new.department,new.commune,new.country_code,new.organization_role,new.beneficiary_name,new.beneficiary_relation,
              new.goal_amount,new.goal_currency,new.deadline,new.urgent,new.cover_path,new.gallery,new.video_url,new.voice_path,new.language,new.budget)
    is distinct from
             (old.title,old.story,old.cause,old.department,old.commune,old.country_code,old.organization_role,old.beneficiary_name,old.beneficiary_relation,
              old.goal_amount,old.goal_currency,old.deadline,old.urgent,old.cover_path,old.gallery,old.video_url,old.voice_path,old.language,old.budget);
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
