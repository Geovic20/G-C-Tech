import { supabase } from './supabase';

/** Public bucket created in migration 0017. */
const BUCKET = 'product-images';
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Uploads a product image to Supabase Storage and returns its public URL.
 * Admin-only at the RLS level (see 0017); the UI already gates this behind the
 * admin area. Returns a stable code on the two client-side guard failures so the
 * caller can localize the message.
 */
export async function uploadProductImage(file: File): Promise<{ url?: string; error?: string }> {
  if (!file.type.startsWith('image/')) return { error: 'NOT_IMAGE' };
  if (file.size > MAX_BYTES) return { error: 'TOO_LARGE' };

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  // A random name avoids collisions and leaks nothing about the original file.
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}
