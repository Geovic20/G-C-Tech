-- =====================================================================
-- G&C Tech — Catalog schema: brands, categories, products
-- Run this in Supabase → SQL Editor (after 0001–0003).
--
-- Public READ on all three tables (the catalog is visible to everyone).
-- No client WRITE policy → inserts/updates only via SQL or service role
-- (a future admin back-office). Products are NOT seeded here.
-- =====================================================================

-- ---------- Tables ----------------------------------------------------
create table if not exists public.brands (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  slug       text not null unique,
  logo_url   text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,   -- smartphones, computers, tablets, headphones, earphones, smartwatches
  name       text not null,          -- display fallback (the app keeps using its i18n keys)
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  price       integer not null check (price >= 0),         -- in CFA
  rating      numeric(2,1) not null default 0 check (rating >= 0 and rating <= 5),
  reviews     integer not null default 0 check (reviews >= 0),
  image       text,
  brand_id    uuid references public.brands(id) on delete set null,
  category_id uuid not null references public.categories(id) on delete restrict,
  type        text,                                        -- sub-type: 'Phones', 'Laptops', 'Gaming'...
  colors      text[] not null default '{}',
  specs       jsonb  not null default '{}'::jsonb,
  in_stock    boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists products_brand_id_idx    on public.products(brand_id);
create index if not exists products_category_id_idx on public.products(category_id);

-- ---------- Row Level Security: public read only ----------------------
alter table public.brands     enable row level security;
alter table public.categories enable row level security;
alter table public.products   enable row level security;

create policy "brands: public read"     on public.brands     for select using (true);
create policy "categories: public read" on public.categories for select using (true);
create policy "products: public read"   on public.products   for select using (true);
-- (No insert/update/delete policies: writes go through SQL / service role.)

-- ---------- Seed: categories -----------------------------------------
insert into public.categories (slug, name, position) values
  ('smartphones',  'Smartphones',  1),
  ('computers',    'Computers',    2),
  ('tablets',      'Tablets',      3),
  ('headphones',   'Headphones',   4),
  ('earphones',    'Earphones',    5),
  ('smartwatches', 'Smartwatches', 6)
on conflict (slug) do nothing;

-- ---------- Seed: brands ---------------------------------------------
insert into public.brands (name, slug) values
  ('Apple',     'apple'),
  ('Samsung',   'samsung'),
  ('Google Pixel',    'google-pixel'),
  ('Redmi', 'redmi'),
  ('POCO', 'poco'),
  ('Nokia', 'nokia'),
  ('Oppo', 'oppo'),
  ('Vivo', 'vivo'),
  ('Realme', 'realme'),
  ('Huawei',    'huawei'),
  ('Xiaomi',    'xiaomi'),
  ('Infinix',   'infinix'),
  ('Itel', 'itel'),
  ('Tecno',     'tecno'),
  ('Oraimo',    'oraimo'),
  ('OnePlus',   'oneplus'),
  ('Nothing',   'nothing'),
  ('Sony',      'sony'),
  ('Bose',      'bose'),
  ('JBL', 'jbl'),
  ('Beats', 'beats'),
  ('HP',        'hp'),
  ('Dell',      'dell'),
  ('Asus',      'asus'),
  ('Lenovo',    'lenovo'),
  ('Acer',      'acer'),
  ('LG',        'lg'),
  ('Motorola',  'motorola'),
  ('Microsoft', 'microsoft'),
  ('Garmin',    'garmin')
on conflict (slug) do nothing;
