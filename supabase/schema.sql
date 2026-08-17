-- Run this in Supabase → SQL Editor

create table if not exists garments (
  id text primary key,
  name text not null,
  category text not null check (category in ('superior', 'inferior', 'calzado')),
  color text not null,
  season text not null,
  image_url text not null,
  source text not null default 'closet' check (source in ('closet', 'store')),
  brand text,
  price integer,
  store_name text,
  created_at timestamptz not null default now()
);

-- Compatible upgrades if the table already exists
alter table garments add column if not exists source text;
alter table garments add column if not exists brand text;
alter table garments add column if not exists price integer;
alter table garments add column if not exists store_name text;

update garments set source = 'closet' where source is null;

create table if not exists favorite_outfits (
  id text primary key,
  payload jsonb not null,
  saved_at timestamptz not null default now()
);

alter table garments enable row level security;
alter table favorite_outfits enable row level security;

do $$ begin
  create policy "garments_public_all" on garments for all using (true) with check (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "favorites_public_all" on favorite_outfits for all using (true) with check (true);
exception when duplicate_object then null;
end $$;

-- Storage bucket for demo garment images (public read)
insert into storage.buckets (id, name, public)
values ('garments', 'garments', true)
on conflict (id) do update set public = true;

do $$ begin
  create policy "garments_storage_public_read"
    on storage.objects for select
    using (bucket_id = 'garments');
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "garments_storage_public_insert"
    on storage.objects for insert
    with check (bucket_id = 'garments');
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "garments_storage_public_update"
    on storage.objects for update
    using (bucket_id = 'garments');
exception when duplicate_object then null;
end $$;
