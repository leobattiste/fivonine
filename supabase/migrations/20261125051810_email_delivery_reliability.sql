-- Keep claim/finish compatibility while adding per-attempt leases and explicit delivery outcomes.
begin;
alter table public.email_outbox
  add column if not exists next_attempt_at timestamptz not null default now(),
  add column if not exists attempted_at timestamptz,
  add column if not exists failed_at timestamptz,
  add column if not exists delivery_uncertain boolean not null default false,
  add column if not exists lease_token uuid,
  add column if not exists lease_started boolean not null default false,
  add column if not exists lease_was_uncertain boolean not null default false,
  add column if not exists lease_result text;

-- Existing unfinished attempts may already have reached the provider. Treat them conservatively.
update public.email_outbox set delivery_uncertain=true,
  attempted_at=coalesce(attempted_at,processing_until-interval '5 minutes',created_at)
where sent_at is null and attempts>0 and attempted_at is null and lease_token is null and lease_result is null;

create index if not exists email_outbox_due_idx on public.email_outbox(next_attempt_at,created_at)
  where sent_at is null and failed_at is null;
comment on column public.email_outbox.attempted_at is 'Start of the unresolved delivery window; never auto-resend an uncertain result after 23 hours.';

create or replace function private.claim_email_batch_v2(backend_secret text) returns setof public.email_outbox
language plpgsql security definer set search_path='' as $$
begin
  if not private.valid_backend(backend_secret) then raise exception 'Unauthorized'; end if;
  -- Resend retains idempotency keys for 24 hours. Leave a one-hour safety margin.
  update public.email_outbox set failed_at=now(),processing_until=null,lease_token=null,
    last_error='delivery_uncertain_manual_review'
    where sent_at is null and failed_at is null and delivery_uncertain
      and attempted_at<=now()-interval '23 hours'
      and (processing_until is null or processing_until<now());
  update public.email_outbox set failed_at=now(),processing_until=null,lease_token=null,
    last_error=case when delivery_uncertain then 'delivery_uncertain_manual_review' else 'retry_limit_reached' end
    where sent_at is null and failed_at is null and attempts>=5
      and (processing_until is null or processing_until<now());
  return query update public.email_outbox set processing_until=now()+interval '5 minutes',lease_token=gen_random_uuid(),lease_started=false,
    lease_was_uncertain=delivery_uncertain,lease_result=null
    where id in (select id from public.email_outbox where sent_at is null and failed_at is null
      and attempts<5 and next_attempt_at<=now()
      and (processing_until is null or processing_until<now())
      order by next_attempt_at,created_at limit 20 for update skip locked)
    returning *;
end $$;
create or replace function public.claim_email_batch_v2(backend_secret text) returns setof public.email_outbox
language sql security invoker set search_path='' as $$ select * from private.claim_email_batch_v2(backend_secret) $$;

create or replace function private.start_email_delivery(backend_secret text,email_id uuid,lease uuid) returns void
language plpgsql security definer set search_path='' as $$
begin
  if not private.valid_backend(backend_secret) then raise exception 'Unauthorized'; end if;
  update public.email_outbox set attempts=attempts+1,lease_started=true,
    attempted_at=case when delivery_uncertain then attempted_at else now() end,delivery_uncertain=true
    where id=email_id and lease_token=lease and lease is not null and processing_until>now() and not lease_started
      and sent_at is null and failed_at is null and attempts<5
      and (not delivery_uncertain or attempted_at>now()-interval '23 hours');
  if not found and not exists(select 1 from public.email_outbox where id=email_id and lease_token=lease
    and processing_until>now() and lease_started and lease_result is null and sent_at is null and failed_at is null)
    then raise exception 'Email lease is unavailable'; end if;
end $$;
create or replace function public.start_email_delivery(backend_secret text,email_id uuid,lease uuid) returns void
language sql security invoker set search_path='' as $$ select private.start_email_delivery(backend_secret,email_id,lease) $$;

create or replace function private.finish_email_result(backend_secret text,email_id uuid,lease uuid,outcome text,err text default null) returns void
language plpgsql security definer set search_path='' as $$
begin
  if not private.valid_backend(backend_secret) then raise exception 'Unauthorized'; end if;
  if outcome not in ('accepted','retryable','permanent','uncertain') or outcome is null then raise exception 'Invalid delivery outcome'; end if;
  update public.email_outbox set
    sent_at=case when outcome='accepted' then now() else null end,
    failed_at=case when outcome='permanent' or (outcome<>'accepted' and attempts>=5) then now() else null end,
    processing_until=null,lease_result=outcome,
    -- A definite rejection of this replay does not resolve an earlier ambiguous send.
    delivery_uncertain=outcome='uncertain' or (outcome='retryable' and lease_was_uncertain),
    attempted_at=case when outcome='uncertain' or (outcome='retryable' and lease_was_uncertain) then attempted_at else null end,
    next_attempt_at=now()+make_interval(mins=>least(60,power(2,greatest(attempts-1,0))::int)),
    last_error=case when outcome='accepted' then null
      when (outcome='uncertain' or (outcome='retryable' and lease_was_uncertain)) and attempts>=5 then 'delivery_uncertain_manual_review'
      else left(coalesce(err,'delivery_failed'),200) end
    where id=email_id and lease_token=lease and lease is not null and lease_started and lease_result is null
      and sent_at is null and failed_at is null;
  if not found and not exists(select 1 from public.email_outbox where id=email_id and lease_token=lease and lease_result=outcome)
    then raise exception 'Email lease is unavailable'; end if;
end $$;
create or replace function public.finish_email_result(backend_secret text,email_id uuid,lease uuid,outcome text,err text default null) returns void
language sql security invoker set search_path='' as $$ select private.finish_email_result(backend_secret,email_id,lease,outcome,err) $$;

-- The previous worker can finish during rollout; the new worker uses per-message start/finish calls.
create or replace function private.claim_email_batch(backend_secret text) returns setof public.email_outbox
language plpgsql security definer set search_path='' as $$
declare job public.email_outbox;
begin
  for job in select * from private.claim_email_batch_v2(backend_secret) loop
    perform private.start_email_delivery(backend_secret,job.id,job.lease_token);
    return query select * from public.email_outbox where id=job.id;
  end loop;
end $$;
create or replace function private.finish_email(backend_secret text,email_id uuid,ok boolean,err text) returns void
language plpgsql security definer set search_path='' as $$
declare token uuid;
begin
  if not private.valid_backend(backend_secret) then raise exception 'Unauthorized'; end if;
  select lease_token into token from public.email_outbox where id=email_id and sent_at is null and failed_at is null;
  if token is null then raise exception 'Email lease is unavailable'; end if;
  perform private.finish_email_result(backend_secret,email_id,token,case when ok then 'accepted' else 'uncertain' end,err);
end $$;

create or replace function private.email_queue_health(backend_secret text) returns jsonb
language plpgsql stable security definer set search_path='' as $$
begin
  if not private.valid_backend(backend_secret) then raise exception 'Unauthorized'; end if;
  return (select jsonb_build_object(
    'pending',count(*) filter(where sent_at is null and failed_at is null),
    'failed',count(*) filter(where failed_at is not null and last_error is distinct from 'launch_test_quarantined'),
    'quarantined',count(*) filter(where failed_at is not null and last_error='launch_test_quarantined'),
    'uncertain',count(*) filter(where sent_at is null and delivery_uncertain),
    'processing',count(*) filter(where sent_at is null and processing_until>now())
  ) from public.email_outbox);
end $$;
create or replace function public.email_queue_health(backend_secret text) returns jsonb
language sql stable security invoker set search_path='' as $$ select private.email_queue_health(backend_secret) $$;

revoke all on function private.claim_email_batch_v2(text),private.start_email_delivery(text,uuid,uuid),
  private.finish_email_result(text,uuid,uuid,text,text),private.email_queue_health(text) from public;
revoke all on function public.claim_email_batch_v2(text),public.start_email_delivery(text,uuid,uuid),
  public.finish_email_result(text,uuid,uuid,text,text),public.email_queue_health(text) from public;
grant execute on function private.claim_email_batch_v2(text),private.start_email_delivery(text,uuid,uuid),
  private.finish_email_result(text,uuid,uuid,text,text),private.email_queue_health(text) to anon,authenticated;
grant execute on function public.claim_email_batch_v2(text),public.start_email_delivery(text,uuid,uuid),
  public.finish_email_result(text,uuid,uuid,text,text),public.email_queue_health(text) to anon,authenticated;

-- Preserve historical test notices without delivering them when real email is enabled.
update public.email_outbox set failed_at=now(),processing_until=null,lease_token=null,last_error='launch_test_quarantined'
where id in ('db27c911-35f5-48e7-a10f-8108d434e2b0','00fd4cc9-7882-4049-9a04-b754409dad21')
  and payload->>'slug'='mksksksk-jtzj' and sent_at is null and failed_at is null;
commit;
