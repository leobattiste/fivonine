-- Narrow backend gateway. The website never needs a Supabase service-role key.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;
create table private.backend_credentials (id boolean primary key default true check(id), token_hash text not null);
alter table private.backend_credentials enable row level security;
revoke all on private.backend_credentials from public, anon, authenticated;
create function private.website_action(action_name text, payload jsonb, backend_secret text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare cid uuid;
begin
 if backend_secret is null or not exists(select 1 from private.backend_credentials where token_hash=encode(sha256(convert_to(backend_secret,'UTF8')),'hex')) then raise exception 'Unauthorized';end if;
 if payload is null or octet_length(payload::text)>15000 then raise exception 'Invalid request';end if;
 if action_name='rate_limit' then
  if coalesce(payload->>'bucket','') !~ '^[a-f0-9]{64}$' then raise exception 'Invalid bucket';end if;
  return to_jsonb(public.consume_rate_limit(payload->>'bucket'));
 elsif action_name='message' then
  if length(coalesce(payload->>'email','')) not between 3 and 254 or payload->>'email' !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or length(coalesce(payload->>'body','')) not between 1 and 5000 or length(coalesce(payload->>'reason',''))>120 or length(coalesce(payload->>'name',''))>160 then raise exception 'Invalid message';end if;
  if payload->>'kind'='report' then
   cid:=(payload->>'campaign_id')::uuid;
   if not exists(select 1 from public.campaigns where id=cid and status='published') then raise exception 'Campaign unavailable';end if;
   insert into public.reports(campaign_id,email,reason,body) values(cid,payload->>'email',payload->>'reason',payload->>'body');
  elsif payload->>'kind'='contact' then
   insert into public.contact_messages(name,email,reason,body) values(payload->>'name',payload->>'email',payload->>'reason',payload->>'body');
  else raise exception 'Invalid message type';end if;
  return 'true'::jsonb;
 elsif action_name='outbound_click' then
  cid:=(payload->>'campaign_id')::uuid;
  if not exists(select 1 from public.campaigns where id=cid and status='published') then raise exception 'Campaign unavailable';end if;
  perform public.record_outbound_click(cid);return 'true'::jsonb;
 else raise exception 'Invalid action';end if;
end $$;
revoke all on function private.website_action(text,jsonb,text) from public;
grant execute on function private.website_action(text,jsonb,text) to anon,authenticated;
create function public.website_action(action_name text,payload jsonb,backend_secret text) returns jsonb language sql security invoker set search_path='' as $$ select private.website_action(action_name,payload,backend_secret) $$;
revoke all on function public.website_action(text,jsonb,text) from public;
grant execute on function public.website_action(text,jsonb,text) to anon,authenticated;
-- Supabase's auto-RLS event trigger is internal, not a public RPC.
do $$begin if to_regprocedure('public.rls_auto_enable()') is not null then execute 'revoke execute on function public.rls_auto_enable() from public,anon,authenticated';end if;end$$;
