-- Covers remain private while a submission is being reviewed.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('covers','covers',false,8388608,array['image/jpeg','image/png','image/webp']);
create policy cover_owner_insert on storage.objects for insert to authenticated with check(bucket_id='covers' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy cover_owner_or_admin_select on storage.objects for select to authenticated using(bucket_id='covers' and ((storage.foldername(name))[1]=(select auth.uid())::text or (select public.is_fivonine_admin())));
create policy cover_owner_delete on storage.objects for delete to authenticated using(bucket_id='covers' and (storage.foldername(name))[1]=(select auth.uid())::text and not exists(select 1 from public.campaigns c where c.status='published' and right(c.public_content->>'photo_url',length('/covers/'||storage.objects.name))='/covers/'||storage.objects.name));
