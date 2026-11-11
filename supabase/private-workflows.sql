-- Keep privileged implementations outside the exposed Data API schema.
alter function public.submit_campaign(jsonb,uuid) set schema private;
alter function public.organizer_request(uuid,text,text,text) set schema private;
alter function public.moderate_campaign(uuid,text,text,text,boolean,boolean) set schema private;
create function public.submit_campaign(content jsonb,campaign_id uuid default null) returns uuid language sql security invoker set search_path='' as $$ select private.submit_campaign(content,campaign_id) $$;
create function public.organizer_request(campaign_id uuid,request_kind text,update_title text default '',update_body text default '') returns void language sql security invoker set search_path='' as $$ select private.organizer_request(campaign_id,request_kind,update_title,update_body) $$;
create function public.moderate_campaign(record_id uuid,record_kind text,decision text,review_note text default '',links_checked boolean default false,organization_checked boolean default false) returns void language sql security invoker set search_path='' as $$ select private.moderate_campaign(record_id,record_kind,decision,review_note,links_checked,organization_checked) $$;
revoke all on function public.submit_campaign(jsonb,uuid),public.organizer_request(uuid,text,text,text),public.moderate_campaign(uuid,text,text,text,boolean,boolean) from public,anon;
grant execute on function public.submit_campaign(jsonb,uuid),public.organizer_request(uuid,text,text,text),public.moderate_campaign(uuid,text,text,text,boolean,boolean) to authenticated;
