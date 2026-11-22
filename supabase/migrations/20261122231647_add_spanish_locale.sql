-- Keep existing profiles, campaigns, category edits and emergency messages intact.
-- Apply this migration before deploying a client that saves the Spanish locale.
begin;

alter table public.profiles drop constraint if exists profiles_locale_check;
alter table public.profiles add constraint profiles_locale_check
  check (locale in ('ht','fr','en','es'));

alter table public.campaigns drop constraint if exists campaigns_language_check;
alter table public.campaigns add constraint campaigns_language_check
  check (language in ('ht','fr','en','es'));

alter table public.categories add column if not exists name_es text not null default '';
update public.categories
set name_es = case slug
  when 'medical' then 'Salud'
  when 'education' then 'Educación'
  when 'emergency' then 'Emergencia'
  when 'community' then 'Comunidad'
  when 'personal' then 'Necesidades personales'
  when 'funeral' then 'Funerales'
  when 'housing' then 'Vivienda'
  when 'food' then 'Alimentación'
  when 'business' then 'Pequeños negocios'
  when 'other' then 'Otras necesidades'
  else coalesce(nullif(name_en, ''), nullif(name_fr, ''), name_ht)
end
where name_es is null or btrim(name_es) = '';

-- Preserve the existing banner and all localized text when adding the new key.
update public.settings
set value = '{"active":false,"ht":"","fr":"","en":"","es":""}'::jsonb || value
where key = 'emergency';

-- Locale is a presentation preference, never an authorization claim.
create or replace function private.handle_new_user() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  insert into public.profiles(id,display_name,locale) values (
    new.id,
    coalesce(nullif(left(btrim(new.raw_user_meta_data->>'display_name'),80),''),'Fivonine member'),
    case when new.raw_user_meta_data->>'locale' in ('ht','fr','en','es') then new.raw_user_meta_data->>'locale' else 'ht' end
  ) on conflict (id) do nothing;
  return new;
end $$;

commit;
