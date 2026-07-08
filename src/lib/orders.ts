import { supabase } from './supabase';
import { CartItem } from '@/src/contexts/CartContext';

export interface CreateOrderInput {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  customerName?: string;
  phone?: string;
  deliveryZone?: string;
  deliveryDetails?: string;
  deliveryDate?: string; // yyyy-mm-dd
  deliveryTime?: string;
  paymentMethod?: string;
}

/**
 * Persists an order + its line items for the logged-in user.
 * Returns silently (no error) if there is no session — guest checkout still
 * works via WhatsApp, it just isn't recorded in the account history.
 */
export async function createOrder(input: CreateOrderInput): Promise<{ error?: string; orderId?: string }> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return {}; // guest: nothing to persist

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: auth.user.id,
      status: 'pending',
      customer_name: input.customerName ?? null,
      phone: input.phone ?? null,
      delivery_zone: input.deliveryZone ?? null,
      delivery_details: input.deliveryDetails ?? null,
      delivery_date: input.deliveryDate || null,
      delivery_time: input.deliveryTime ?? null,
      subtotal: input.subtotal,
      shipping: input.shipping,
      tax: input.tax,
      total: input.total,
      payment_method: input.paymentMethod ?? 'whatsapp',
    })
    .select('id')
    .single();

  if (error || !order) return { error: error?.message ?? 'order insert failed' };

  const rows = input.items.map((it) => ({
    order_id: order.id,
    product_id: it.id,
    name: it.name,
    price: it.price,
    quantity: it.quantity,
    image: it.image,
  }));
  const { error: itemsError } = await supabase.from('order_items').insert(rows);
  if (itemsError) return { error: itemsError.message };

  return { orderId: order.id };
}

// ----------------------- Read (user's own orders) -----------------------

export type MyOrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface MyOrderItem {
  id: string;
  product_id: string | null;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
}

export interface MyOrder {
  id: string;
  order_number: number;
  status: MyOrderStatus;
  total: number;
  created_at: string;
  order_items: MyOrderItem[];
}

export async function listMyOrders(): Promise<MyOrder[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('id,order_number,status,total,created_at,order_items(id,product_id,name,image,price,quantity)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as MyOrder[];
}
