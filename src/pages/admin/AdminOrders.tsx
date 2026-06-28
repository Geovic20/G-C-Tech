import React, { useEffect, useState } from 'react';
import AdminLayout from '@/src/components/AdminLayout';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useCurrency } from '@/src/contexts/CurrencyContext';
import { adminListOrders, adminUpdateOrderStatus, AdminOrder, OrderStatus } from '@/src/lib/admin';

const STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: 'bg-amber-50 text-amber-600',
  confirmed: 'bg-blue-50 text-blue-600',
  shipped: 'bg-indigo-50 text-indigo-600',
  delivered: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-red-50 text-red-600',
};

export default function AdminOrders() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const { formatPrice } = useCurrency();
  const locale = fr ? 'fr-FR' : 'en-US';

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const statusLabel = (s: OrderStatus) => {
    const frMap: Record<OrderStatus, string> = {
      pending: 'En attente', confirmed: 'Confirmée', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée',
    };
    const enMap: Record<OrderStatus, string> = {
      pending: 'Pending', confirmed: 'Confirmed', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled',
    };
    return (fr ? frMap : enMap)[s];
  };

  const load = async () => {
    setError('');
    try {
      setOrders(await adminListOrders());
    } catch (e: any) {
      setError(e?.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (order: AdminOrder, status: OrderStatus) => {
    setBusyId(order.id);
    const result = await adminUpdateOrderStatus(order.id, status);
    setBusyId(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
  };

  return (
    <AdminLayout title={fr ? 'Commandes' : 'Orders'}>
      <p className="text-gray-500 text-sm mb-6">
        {loading ? '…' : `${orders.length} ${fr ? 'commandes' : 'orders'}`}
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">{error}</div>
      )}

      {!loading && orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          {fr ? 'Aucune commande pour le moment.' : 'No orders yet.'}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50/70 px-5 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <span className="font-black text-gray-900">#{o.order_number}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(o.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_STYLE[o.status]}`}>
                    {statusLabel(o.status)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-gray-900">{formatPrice(o.total)}</span>
                  <select
                    value={o.status}
                    disabled={busyId === o.id}
                    onChange={(e) => changeStatus(o, e.target.value as OrderStatus)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{statusLabel(s)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer */}
                <div className="text-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{fr ? 'Client' : 'Customer'}</p>
                  <p className="font-bold text-gray-900">{o.customer_name || '—'}</p>
                  <p className="text-gray-500">{o.phone || '—'}{o.delivery_zone ? ` · ${o.delivery_zone}` : ''}</p>
                  <p className="text-gray-400 text-xs mt-1">{fr ? 'Paiement' : 'Payment'}: {o.payment_method}</p>
                </div>
                {/* Items */}
                <div className="text-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{fr ? 'Articles' : 'Items'}</p>
                  <ul className="space-y-1">
                    {o.order_items?.map((it) => (
                      <li key={it.id} className="flex justify-between gap-3 text-gray-600">
                        <span className="truncate">{it.name} <span className="text-gray-400">× {it.quantity}</span></span>
                        <span className="font-medium text-gray-900 whitespace-nowrap">{formatPrice(it.price * it.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
