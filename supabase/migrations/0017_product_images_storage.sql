-- =====================================================================
-- 2G HUB — Stockage des images produits (Supabase Storage)
-- Run this in Supabase → SQL Editor (after 0016).
--
-- Crée un bucket public « product-images » et ses politiques :
--   • lecture publique (les images s'affichent sur la boutique sans auth) ;
--   • écriture réservée aux admins (upload/remplacement/suppression), via la
--     fonction is_admin() déjà définie en 0006.
--
-- Le bucket est « public » : les fichiers sont servis par une URL publique
-- stable (getPublicUrl côté app). La RLS ci-dessous ne régit que l'écriture.
--
-- Idempotent : rejouable sans effet (le bucket est ignoré s'il existe, les
-- politiques sont recréées).
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Lecture publique des objets du bucket.
drop policy if exists "product-images: public read" on storage.objects;
create policy "product-images: public read"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Écriture réservée aux administrateurs.
drop policy if exists "product-images: admin insert" on storage.objects;
create policy "product-images: admin insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product-images: admin update" on storage.objects;
create policy "product-images: admin update"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "product-images: admin delete" on storage.objects;
create policy "product-images: admin delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
