import { supabase } from './supabase';

/** Returns the product ids the current user has favorited. */
export async function listWishlist(): Promise<string[]> {
  const { data, error } = await supabase.from('wishlists').select('product_id');
  if (error) throw error;
  return (data ?? []).map((r) => (r as { product_id: string }).product_id);
}

export async function addWishlist(productId: string): Promise<{ error?: string }> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: 'NOT_AUTHENTICATED' };
  const { error } = await supabase
    .from('wishlists')
    .insert({ user_id: auth.user.id, product_id: productId });
  // Ignore duplicate (already favorited).
  if (error && (error as any).code !== '23505') return { error: error.message };
  return {};
}

export async function removeWishlist(productId: string): Promise<{ error?: string }> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: 'NOT_AUTHENTICATED' };
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', auth.user.id)
    .eq('product_id', productId);
  return error ? { error: error.message } : {};
}
