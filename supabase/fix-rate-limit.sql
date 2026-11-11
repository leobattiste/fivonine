create or replace function public.consume_rate_limit(bucket text) returns boolean language plpgsql security invoker set search_path='' as $$
declare n int;
begin insert into public.request_limits as r(bucket) values(bucket) on conflict on constraint request_limits_pkey do update set hits=case when r.window_started<now()-interval '1 hour' then 1 else r.hits+1 end,window_started=case when r.window_started<now()-interval '1 hour' then now() else r.window_started end returning hits into n;return n<=5;end $$;
