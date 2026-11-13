insert into public.categories (slug,name_en,name_fr,name_ht,position,active)
values ('personal','Personal needs','Besoins personnels','Bezwen pèsonèl',5,true)
on conflict (slug) do update set name_en=excluded.name_en,name_fr=excluded.name_fr,name_ht=excluded.name_ht,position=5,active=true;
update public.categories set name_en='Medical',name_fr='Médical',position=1 where slug='medical';
update public.categories set position=2 where slug='education';
update public.categories set name_en='Emergency',name_fr='Urgence',position=3 where slug='emergency';
update public.categories set name_en='Community',name_fr='Communauté',position=4 where slug='community';
update public.campaigns set cause='personal' where cause in ('funeral','housing','food','business','other');
update public.categories set active=false where slug in ('funeral','housing','food','business','other');
