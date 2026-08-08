-- Run this in Supabase → SQL Editor

create table if not exists garments (
  id text primary key,
  name text not null,
  category text not null check (category in ('superior', 'inferior', 'calzado')),
  color text not null,
  season text not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

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
