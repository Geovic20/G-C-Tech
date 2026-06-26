-- =====================================================================
-- G&C Tech — Seed the 22 catalog products (migrated from constants.ts)
-- Run this in Supabase → SQL Editor (after 0004 created brands/categories).
-- Idempotent: re-running does nothing (on conflict on slug).
-- Brand/category are resolved by slug.
-- =====================================================================

insert into public.products
  (name, slug, description, price, rating, reviews, image, brand_id, category_id, type, colors, specs)
values
-- ---------- Smartphones ----------
('iPhone 15 Pro','iphone-15-pro','The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system.',999000,4.9,128,'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500&h=500&fit=crop',
  (select id from public.brands where slug='apple'), (select id from public.categories where slug='smartphones'),
  'Phones','{#2F2F2F,#E3E2DE,#BCC1D5,#3C3A35}','{"Brand":"Apple","Chip":"A17 Pro","Display":"6.1-inch Super Retina XDR","Camera":"48MP Main | Ultra Wide | Telephoto","Battery":"Up to 23 hours video playback"}'::jsonb),
('Samsung Galaxy S24 Ultra','samsung-galaxy-s24-ultra','Experience the next level of mobile technology with Galaxy AI and the powerful S Pen.',1299000,4.8,95,'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop',
  (select id from public.brands where slug='samsung'), (select id from public.categories where slug='smartphones'),
  'Phones','{#2E2E2E,#EAEAEA,#F5E6CC,#D1C4E9}','{"Brand":"Samsung","Chip":"Snapdragon 8 Gen 3","Display":"6.8-inch QHD+ Dynamic AMOLED 2X","Camera":"200MP Main | 50MP Telephoto","Battery":"5000 mAh"}'::jsonb),
('Google Pixel 8 Pro','google-pixel-8-pro','The all-pro phone engineered by Google with the best Pixel camera yet.',899000,4.7,112,'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop',
  (select id from public.brands where slug='google-pixel'), (select id from public.categories where slug='smartphones'),
  'Phones','{}','{}'::jsonb),
('OnePlus 12','oneplus-12','Flagship performance with a fluid display and ultra-fast charging.',799000,4.6,84,'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=500&h=500&fit=crop',
  (select id from public.brands where slug='oneplus'), (select id from public.categories where slug='smartphones'),
  'Phones','{}','{}'::jsonb),
('Xiaomi 14 Ultra','xiaomi-14-ultra','Pro-grade Leica optics meet powerful performance in a premium build.',1199000,4.8,42,'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
  (select id from public.brands where slug='xiaomi'), (select id from public.categories where slug='smartphones'),
  'Phones','{}','{}'::jsonb),
('Nothing Phone (2)','nothing-phone-2','A unique design with the Glyph interface and clean, fast software.',599000,4.5,67,'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=500&h=500&fit=crop',
  (select id from public.brands where slug='nothing'), (select id from public.categories where slug='smartphones'),
  'Phones','{}','{}'::jsonb),
-- ---------- Computers ----------
('MacBook Pro M3 Max','macbook-pro-m3-max','The most advanced chips ever built for a personal computer. Spectacular battery life.',3499000,5.0,45,'https://images.unsplash.com/photo-1517336712468-077648f3efbc?w=500&h=500&fit=crop',
  (select id from public.brands where slug='apple'), (select id from public.categories where slug='computers'),
  'Laptops','{#1C1C1C,#E3E4E5}','{"Brand":"Apple","Chip":"M3 Max","RAM":"Up to 128GB","Display":"14-inch or 16-inch Liquid Retina XDR"}'::jsonb),
('Dell XPS 15','dell-xps-15','A premium Windows laptop with a stunning InfinityEdge display.',1899000,4.8,72,'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop',
  (select id from public.brands where slug='dell'), (select id from public.categories where slug='computers'),
  'Laptops','{}','{}'::jsonb),
('ASUS ROG Zephyrus G14','asus-rog-zephyrus-g14','A compact powerhouse built for high-end gaming and creative workloads.',1599000,4.9,88,'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop',
  (select id from public.brands where slug='asus'), (select id from public.categories where slug='computers'),
  'Gaming','{}','{}'::jsonb),
('iMac 24-inch M3','imac-24-m3','A strikingly thin all-in-one desktop with a vibrant 4.5K Retina display.',1299000,4.7,31,'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop',
  (select id from public.brands where slug='apple'), (select id from public.categories where slug='computers'),
  'Desktops','{}','{}'::jsonb),
-- ---------- Tablets ----------
('iPad Pro 12.9 M2','ipad-pro-12-9-m2','The ultimate iPad experience. Now with next-generation performance and a brilliant display.',1099000,4.9,156,'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
  (select id from public.brands where slug='apple'), (select id from public.categories where slug='tablets'),
  'Tablets','{}','{}'::jsonb),
('Samsung Galaxy Tab S9 Ultra','samsung-galaxy-tab-s9-ultra','A massive AMOLED display and S Pen support for work and play.',1199000,4.8,42,'https://images.unsplash.com/photo-1561154464-82e9aff32764?w=500&h=500&fit=crop',
  (select id from public.brands where slug='samsung'), (select id from public.categories where slug='tablets'),
  'Tablets','{}','{}'::jsonb),
('Microsoft Surface Pro 9','microsoft-surface-pro-9','The versatile 2-in-1 that is a tablet and a laptop in one device.',999000,4.6,78,'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=500&h=500&fit=crop',
  (select id from public.brands where slug='microsoft'), (select id from public.categories where slug='tablets'),
  'Tablets','{}','{}'::jsonb),
-- ---------- Headphones ----------
('Sony WH-1000XM5','sony-wh-1000xm5','Industry-leading noise cancellation. Spectacular sound quality and multi-point connection.',349000,4.8,210,'https://images.unsplash.com/photo-1546435770-a3e426ff472b?w=500&h=500&fit=crop',
  (select id from public.brands where slug='sony'), (select id from public.categories where slug='headphones'),
  'Headphones','{#000000,#F5F5DC}','{"Brand":"Sony","Connectivity":"Bluetooth 5.2","Battery Life":"30 hours","Noise Canceling":"Yes"}'::jsonb),
('Bose QuietComfort Ultra','bose-quietcomfort-ultra','World-class noise cancellation with immersive spatial audio.',379000,4.9,145,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
  (select id from public.brands where slug='bose'), (select id from public.categories where slug='headphones'),
  'Headphones','{}','{}'::jsonb),
('AirPods Max','airpods-max','High-fidelity audio with Active Noise Cancellation and a premium design.',549000,4.7,89,'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=500&h=500&fit=crop',
  (select id from public.brands where slug='apple'), (select id from public.categories where slug='headphones'),
  'Headphones','{}','{}'::jsonb),
-- ---------- Earphones ----------
('AirPods Pro (2nd Gen)','airpods-pro-2nd-gen','Next-level Active Noise Cancellation and Adaptive Transparency.',249000,4.9,312,'https://images.unsplash.com/photo-1588423770186-80f336a04b71?w=500&h=500&fit=crop',
  (select id from public.brands where slug='apple'), (select id from public.categories where slug='earphones'),
  'Earphones','{}','{}'::jsonb),
('Sony WF-1000XM5','sony-wf-1000xm5','The best truly wireless earbuds for noise cancellation and sound quality.',299000,4.8,124,'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop',
  (select id from public.brands where slug='sony'), (select id from public.categories where slug='earphones'),
  'Earphones','{}','{}'::jsonb),
('Samsung Galaxy Buds2 Pro','samsung-galaxy-buds2-pro','Compact earbuds with intelligent ANC and 360 Audio.',199000,4.7,86,'https://images.unsplash.com/photo-1590658006244-85710daaff1a?w=500&h=500&fit=crop',
  (select id from public.brands where slug='samsung'), (select id from public.categories where slug='earphones'),
  'Earphones','{}','{}'::jsonb),
-- ---------- Smartwatches ----------
('Apple Watch Ultra 2','apple-watch-ultra-2','The most rugged and capable Apple Watch pushes the limits again.',799000,4.9,64,'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop',
  (select id from public.brands where slug='apple'), (select id from public.categories where slug='smartwatches'),
  'Watches','{}','{}'::jsonb),
('Samsung Galaxy Watch6 Classic','samsung-galaxy-watch6-classic','A timeless design with a rotating bezel and advanced health tracking.',399000,4.7,112,'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
  (select id from public.brands where slug='samsung'), (select id from public.categories where slug='smartwatches'),
  'Watches','{}','{}'::jsonb),
('Garmin Epix Gen 2','garmin-epix-gen-2','A premium multisport GPS smartwatch with a brilliant AMOLED display.',899000,4.8,45,'https://images.unsplash.com/photo-1508685096489-7aac29a21244?w=500&h=500&fit=crop',
  (select id from public.brands where slug='garmin'), (select id from public.categories where slug='smartwatches'),
  'Watches','{}','{}'::jsonb)
on conflict (slug) do nothing;
