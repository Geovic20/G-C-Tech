-- =====================================================================
-- 2G HUB — Galerie d'images produit (images supplémentaires)
-- Run this in Supabase → SQL Editor (after 0017).
--
-- La colonne `image` reste l'image PRINCIPALE (utilisée partout : cartes,
-- listes, aperçus). `images` ajoute les angles supplémentaires affichés en
-- miniatures sur la fiche produit. La galerie = image + images.
--
-- Les politiques RLS existantes (products: admin insert/update, 0006) couvrent
-- déjà cette colonne. Idempotent.
-- =====================================================================

alter table public.products
  add column if not exists images text[] not null default '{}';

comment on column public.products.images is
  'Images supplémentaires (galerie), en plus de `image` (principale).';
