-- =====================================================================
-- G&C Tech — Orders (commandes)
-- Run this in Supabase → SQL Editor (after 0001–0004).
--
-- An order is a SNAPSHOT of what the customer ordered (product names, prices,
-- delivery info, totals) so historical orders stay correct even if a product's
-- price/name later changes. Orders belong to a logged-in user (RLS: own rows).
-- Payment stays on WhatsApp for now; `status` is managed by you / a future admin.
-- =====================================================================

-- ---------- Tables ----------------------------------------------------
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  order_number     bigint generated always as identity,      -- human-friendly #
  user_id          uuid not null references auth.users(id) on delete cascade,
  status           text not null default 'pending'
                     check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  -- Delivery snapshot
  customer_name    text,
  phone            text,
  delivery_zone    text,
  delivery_details text,
  delivery_date    date,
  delivery_time    text,
  -- Amount snapshot (in CFA)
  subtotal         integer not null default 0 check (subtotal >= 0),
  shipping         integer not null default 0 check (shipping >= 0),
  tax              integer not null default 0 check (tax >= 0),
  total            integer not null default 0 check (total >= 0),
  payment_method   text not null default 'whatsapp',
  created_at       timestamptz not null default now()
);

create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  product_id text,                                            -- soft link (no FK: keep history if product is removed)
  name       text not null,                                   -- snapshot
  price      integer not null check (price >= 0),             -- unit price snapshot (CFA)
  quantity   integer not null check (quantity > 0),
  image      text,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx       on public.orders(user_id);
create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- ---------- Row Level Security ---------------------------------------
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- Orders: a user only sees / creates their own.
create policy "orders: select own" on public.orders
  for select using (auth.uid() = user_id);
create policy "orders: insert own" on public.orders
  for insert with check (auth.uid() = user_id);

-- Order items: tied to an order owned by the user.
create policy "order_items: select own" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "order_items: insert own" on public.order_items
  for insert with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- NOTE: no client UPDATE/DELETE policy. Order status is changed by you / a
-- future admin back-office (service role), not by the customer.
