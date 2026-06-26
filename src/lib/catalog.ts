import { supabase } from './supabase';
import { Product, ProductGroup } from '@/src/constants';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  position: number;
}

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  rating: number | string;
  reviews: number;
  image: string | null;
  type: string | null;
  colors: string[] | null;
  specs: Record<string, string> | null;
  brands: { name: string } | null;
  categories: { slug: string } | null;
}

/** Maps a DB row to the app's existing Product shape so components stay unchanged. */
function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    price: row.price,
    rating: Number(row.rating),
    reviews: row.reviews,
    image: row.image ?? '',
    category: row.type ?? row.categories?.slug ?? '',
    group: (row.categories?.slug ?? 'smartphones') as ProductGroup,
    colors: row.colors && row.colors.length ? row.colors : undefined,
    specs: row.specs && Object.keys(row.specs).length ? row.specs : undefined,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(
      'id,name,slug,description,price,rating,reviews,image,type,colors,specs,brands(name),categories(slug)'
    )
    .order('created_at', { ascending: true });
  if (error) throw error;
  return ((data ?? []) as unknown as ProductRow[]).map(mapProduct);
}

export async function fetchBrands(): Promise<Brand[]> {
  const { data, error } = await supabase.from('brands').select('*').order('name');
  if (error) throw error;
  return (data ?? []) as Brand[];
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('position');
  if (error) throw error;
  return (data ?? []) as Category[];
}
