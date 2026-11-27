-- Supporters can attach transfer details (reference number, date, sender phone, receipt) to the help they report.
-- Visible only to the supporter, the fundraiser's owner and team, and admins.
alter table public.contributions
  add column if not exists reference text check (char_length(reference) <= 60),
  add column if not exists sent_on date,
  add column if not exists sender_phone text check (char_length(sender_phone) <= 30),
  add column if not exists receipt_path text check (char_length(receipt_path) <= 200);

-- Own rows, the owner's rows and admins' rows are already the only ones the read policy lets through.
-- received_at must be readable too, otherwise select * (account export) fails.
grant select (received_at, reference, sent_on, sender_phone, receipt_path) on public.contributions to authenticated;
grant insert (reference, sent_on, sender_phone, receipt_path) on public.contributions to authenticated;

create or replace function private.guard_contribution() returns trigger language plpgsql security definer set search_path='' as $$
declare n int;
begin
  select count(*) into n from public.contributions where user_id=new.user_id and campaign_id=new.campaign_id and created_at>now()-interval '1 day';
  if n>=5 then raise exception 'Daily limit reached for this campaign'; end if;
  if new.anonymous then new.display_name:=null; end if;
  new.hidden:=false;
  new.received_at:=null;
  if new.sent_on is not null and new.sent_on>current_date+1 then new.sent_on:=null; end if;
  if new.receipt_path is not null and new.receipt_path !~ ('^'||new.user_id::text||'/[a-z0-9-]{8,60}\.(webp|jpg|jpeg|png|pdf)$') then
    raise exception 'Invalid receipt';
  end if;
  return new;
end $$;

drop function if exists public.campaign_support_records(uuid);
drop function if exists private.campaign_support_records(uuid);
create function private.campaign_support_records(cid uuid)
returns table(id uuid, amount numeric, currency text, method text, display_name text, anonymous boolean, message text, created_at timestamptz, received_at timestamptz, reference text, sent_on date, sender_phone text, receipt_path text)
language sql stable security definer set search_path='' as $$
  select k.id,k.amount,k.currency,k.method,k.display_name,k.anonymous,k.message,k.created_at,k.received_at,k.reference,k.sent_on,k.sender_phone,k.receipt_path
  from public.contributions k
  where k.campaign_id=cid and not k.hidden and (private.owns_campaign(cid) or private.is_member(cid))
  order by k.created_at desc limit 200
$$;
create function public.campaign_support_records(cid uuid)
returns table(id uuid, amount numeric, currency text, method text, display_name text, anonymous boolean, message text, created_at timestamptz, received_at timestamptz, reference text, sent_on date, sender_phone text, receipt_path text)
language sql stable security invoker set search_path='' as $$ select * from private.campaign_support_records(cid) $$;
revoke all on function private.campaign_support_records(uuid),public.campaign_support_records(uuid) from public,anon,authenticated;
grant execute on function private.campaign_support_records(uuid),public.campaign_support_records(uuid) to authenticated;

-- The organizer and team can open the receipt attached to help reported for their fundraiser.
create policy documents_read_receipts on storage.objects for select to authenticated
  using (bucket_id='documents' and exists(
    select 1 from public.contributions k where k.receipt_path=name and (private.owns_campaign(k.campaign_id) or private.is_member(k.campaign_id))
  ));
