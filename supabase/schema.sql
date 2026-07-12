-- ============================================================
-- CAFE KASSA — Supabase sxemasi
-- Buni Supabase loyihangizda: SQL Editor > New query > Run
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- KATEGORIYALAR ----------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- MAHSULOTLAR ----------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text,          -- tarkibi
  price numeric not null default 0,       -- sotuv narxi
  cost_price numeric not null default 0,  -- tannarx
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- BUYURTMALAR (CHEKLAR) ----------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  total numeric not null default 0,
  total_cost numeric not null default 0,
  profit numeric not null default 0,
  payment_method text not null check (payment_method in ('card','cash','mixed')),
  card_amount numeric not null default 0,
  cash_amount numeric not null default 0
);

-- ---------- BUYURTMA TARKIBI ----------
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,   -- nusxa saqlanadi (mahsulot keyin o'zgarsa ham chek to'g'ri qoladi)
  unit_price numeric not null default 0,
  unit_cost numeric not null default 0,
  quantity int not null default 1,
  line_total numeric not null default 0
);

create index if not exists idx_products_category on products(category_id);
create index if not exists idx_order_items_order on order_items(order_id);
create index if not exists idx_orders_created on orders(created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- Bu yerda soddalik uchun "anon" (ochiq) kalit bilan to'liq
-- o'qish/yozishga ruxsat berilgan — chunki ilova bitta kassa
-- ichida, login talab qilinmaydi. Agar ko'p xodim/filial bo'lsa,
-- keyinchalik auth qo'shib policy'larni qattiqlashtirish mumkin.
-- ============================================================

alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "categories_all" on categories for all using (true) with check (true);
create policy "products_all" on products for all using (true) with check (true);
create policy "orders_all" on orders for all using (true) with check (true);
create policy "order_items_all" on order_items for all using (true) with check (true);

-- ============================================================
-- STORAGE — mahsulot rasmlari uchun bucket
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_public_read"
on storage.objects for select
using (bucket_id = 'product-images');

create policy "product_images_public_write"
on storage.objects for insert
with check (bucket_id = 'product-images');

create policy "product_images_public_update"
on storage.objects for update
using (bucket_id = 'product-images');

create policy "product_images_public_delete"
on storage.objects for delete
using (bucket_id = 'product-images');

-- ============================================================
-- NAMUNA MA'LUMOTLAR (ixtiyoriy — sinab ko'rish uchun)
-- ============================================================
insert into categories (name, sort_order) values
  ('Issiq ichimliklar', 0),
  ('Sovuq ichimliklar', 1),
  ('Desertlar', 2)
on conflict do nothing;
