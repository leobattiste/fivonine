-- Organizers can choose every category again.
update public.categories set active = true,
  position = case slug when 'medical' then 1 when 'education' then 2 when 'emergency' then 3 when 'funeral' then 4 when 'housing' then 5
    when 'food' then 6 when 'personal' then 7 when 'business' then 8 when 'community' then 9 when 'other' then 10 else position end;

-- Gallery accepts short phone videos. Photos are still resized in the browser before upload.
update storage.buckets
   set file_size_limit = 52428800,
       allowed_mime_types = array['image/webp','image/jpeg','image/png','audio/webm','audio/mp4','audio/ogg','audio/mpeg','video/mp4','video/webm','video/quicktime']
 where id = 'media';
