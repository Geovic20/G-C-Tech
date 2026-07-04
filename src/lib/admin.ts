import { supabase } from './supabase';

// ----------------------- Products -----------------------

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  rating: number;
  reviews: number;
  image: string | null;
  brand_id: string | null;
  category_id: string;
  type: string | null;
  in_stock: boolean;
  specs: Record<string, string> | null;
  brands?: { name: string } | null;
  categories?: { slug: string; name: string } | null;
}

export interface ProductInput {
  name: string;
  slug: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  brand_id: string | null;
  category_id: string;
  type: string;
  in_stock: boolean;
  specs: Record<string, string>;
}

export async function adminListProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id,name,slug,description,price,rating,reviews,image,brand_id,category_id,type,in_stock,specs,brands(name),categories(slug,name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as AdminProduct[];
}

export async function adminCreateProduct(input: ProductInput): Promise<{ error?: string }> {
  const { error } = await supabase.from('products').insert(input);
  return error ? { error: error.message } : {};
}

export async function adminUpdateProduct(id: string, input: ProductInput): Promise<{ error?: string }> {
  const { error } = await supabase.from('products').update(input).eq('id', id);
  return error ? { error: error.message } : {};
}

export async function adminDeleteProduct(id: string): Promise<{ error?: string }> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  return error ? { error: error.message } : {};
}

// ----------------------- Orders -----------------------

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface AdminOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

export interface AdminOrder {
  id: string;
  order_number: number;
  status: OrderStatus;
  customer_name: string | null;
  phone: string | null;
  delivery_zone: string | null;
  total: number;
  payment_method: string;
  created_at: string;
  order_items: AdminOrderItem[];
}

export async function adminListOrders(): Promise<AdminOrder[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('id,order_number,status,customer_name,phone,delivery_zone,total,payment_method,created_at,order_items(id,name,price,quantity,image)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as AdminOrder[];
}

export async function adminUpdateOrderStatus(id: string, status: OrderStatus): Promise<{ error?: string }> {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  return error ? { error: error.message } : {};
}

// ----------------------- Users -----------------------

export type UserRole = 'customer' | 'admin';

export interface AdminUser {
  id: string;
  email: string | null;
  fullname: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
}

export async function adminListUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,email,fullname,phone,role,created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as AdminUser[];
}

export async function adminSetUserRole(id: string, role: UserRole): Promise<{ error?: string }> {
  const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
  return error ? { error: error.message } : {};
}

/** Simple slugifier for product slugs (accents stripped, spaces -> dashes). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
