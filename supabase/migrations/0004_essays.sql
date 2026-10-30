-- Long-form decade essays: an ordered list of blocks (year headings, paragraphs, captioned images).
alter table periods add column if not exists essay jsonb;
