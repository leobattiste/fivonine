-- Apply after the new application is deployed and reads public notes through its safe projection.
begin;
revoke select on public.contributions from public,anon,authenticated;
revoke select (id,campaign_id,amount,currency,method,display_name,anonymous,message,hidden,created_at) on public.contributions from public,anon;
grant select (id,campaign_id,amount,currency,method,display_name,anonymous,message,hidden,created_at) on public.contributions to authenticated;
drop policy if exists contributions_read_public on public.contributions;
drop policy if exists contributions_read on public.contributions;
create policy contributions_read on public.contributions for select to authenticated
  using (user_id=(select auth.uid()) or (select private.is_admin()) or exists(
    select 1 from public.campaigns c where c.id=campaign_id and c.owner_id=(select auth.uid())
  ));
commit;
