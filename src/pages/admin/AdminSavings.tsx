import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Wallet, Ban, X, AlertTriangle } from 'lucide-react';
import AdminLayout from '@/src/components/AdminLayout';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useCurrency } from '@/src/contexts/CurrencyContext';
import {
  adminListSavings,
  adminUpdateSavingsStatus,
  adminCancelSavings,
  adminListPlanContributions,
  AdminSavingsPlan,
  AdminContribution,
  SavingsStatus,
} from '@/src/lib/admin';

// Statuts que l'admin peut appliquer via le menu déroulant. 'cancelled' en est
// volontairement absent : l'annulation passe par un bouton dédié + motif.
const STATUSES: SavingsStatus[] = ['active', 'suspended', 'completed', 'cancelled'];
const TRANSITION_STATUSES: SavingsStatus[] = ['active', 'suspended', 'completed'];

const STATUS_STYLE: Record<SavingsStatus, string> = {
  active: 'bg-blue-50 text-blue-600',
  suspended: 'bg-amber-50 text-amber-600',
  completed: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-red-50 text-red-600',
};

const GROUP_LABELS: Record<string, { fr: string; en: string }> = {
  smartphones: { fr: 'Smartphones', en: 'Smartphones' },
  computers: { fr: 'Ordinateurs', en: 'Computers' },
  tablets: { fr: 'Tablettes', en: 'Tablets' },
  headphones: { fr: 'Casques', en: 'Headphones' },
  earphones: { fr: 'Écouteurs', en: 'Earphones' },
  smartwatches: { fr: 'Montres', en: 'Watches' },
};

export default function AdminSavings() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const locale = fr ? 'fr-FR' : 'en-US';
  const { formatPrice } = useCurrency();

  const [plans, setPlans] = useState<AdminSavingsPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<SavingsStatus | 'all'>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');

  // Expandable payment history per plan.
  const [expanded, setExpanded] = useState<string | null>(null);
  const [history, setHistory] = useState<Record<string, AdminContribution[]>>({});
  const [historyLoading, setHistoryLoading] = useState<string | null>(null);

  // Cancellation flow: dedicated confirmation modal with a mandatory reason.
  const [cancelTarget, setCancelTarget] = useState<AdminSavingsPlan | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelBusy, setCancelBusy] = useState(false);

  const statusLabel = (s: SavingsStatus) => {
    const frMap = { active: 'En cours', suspended: 'Suspendue', completed: 'Terminée', cancelled: 'Annulée' };
    const enMap = { active: 'Active', suspended: 'Suspended', completed: 'Completed', cancelled: 'Cancelled' };
    return (fr ? frMap : enMap)[s];
  };
  const groupLabel = (g: string | null) =>
    !g ? (fr ? 'Autre' : 'Other') : GROUP_LABELS[g] ? (fr ? GROUP_LABELS[g].fr : GROUP_LABELS[g].en) : g;

  const load = async () => {
    setError('');
    try {
      setPlans(await adminListSavings());
    } catch (e: any) {
      setError(e?.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: plans.length, active: 0, suspended: 0, completed: 0, cancelled: 0 };
    plans.forEach((p) => (c[p.status] = (c[p.status] ?? 0) + 1));
    return c;
  }, [plans]);

  const totalSaved = useMemo(() => plans.reduce((s, p) => s + p.saved_amount, 0), [plans]);
  const presentGroups = useMemo(
    () => Array.from(new Set(plans.map((p) => p.product_group).filter(Boolean))) as string[],
    [plans]
  );

  const filtered = plans.filter(
    (p) =>
      (statusFilter === 'all' || p.status === statusFilter) &&
      (groupFilter === 'all' || p.product_group === groupFilter)
  );

  const changeStatus = async (plan: AdminSavingsPlan, status: SavingsStatus) => {
    setBusyId(plan.id);
    setError('');
    const result = await adminUpdateSavingsStatus(plan.id, status);
    setBusyId(null);
    if (result.error) {
      setError(
        result.error === 'ACTIVE_PLAN_EXISTS'
          ? (fr
              ? "Impossible : ce client a déjà une épargne active. Suspendez/terminez l'autre d'abord."
              : 'Cannot: this customer already has an active plan. Suspend/finish the other one first.')
          : result.error
      );
      return;
    }
    setPlans((prev) => prev.map((p) => (p.id === plan.id ? { ...p, status } : p)));
  };

  const openCancel = (plan: AdminSavingsPlan) => {
    setCancelReason('');
    setError('');
    setCancelTarget(plan);
  };

  const confirmCancel = async () => {
    if (!cancelTarget || !cancelReason.trim()) return;
    setCancelBusy(true);
    const result = await adminCancelSavings(cancelTarget.id, cancelReason);
    setCancelBusy(false);
    if (result.error) {
      setError(result.error === 'REASON_REQUIRED' ? (fr ? 'Le motif est obligatoire.' : 'A reason is required.') : result.error);
      return;
    }
    const reason = cancelReason.trim();
    const cancelledAt = new Date().toISOString();
    setPlans((prev) =>
      prev.map((p) =>
        p.id === cancelTarget.id ? { ...p, status: 'cancelled', cancellation_reason: reason, cancelled_at: cancelledAt } : p
      )
    );
    setCancelTarget(null);
    setCancelReason('');
  };

  const toggleHistory = async (planId: string) => {
    if (expanded === planId) {
      setExpanded(null);
      return;
    }
    setExpanded(planId);
    if (!history[planId]) {
      setHistoryLoading(planId);
      try {
        const items = await adminListPlanContributions(planId);
        setHistory((prev) => ({ ...prev, [planId]: items }));
      } catch {
        setHistory((prev) => ({ ...prev, [planId]: [] }));
      } finally {
        setHistoryLoading(null);
      }
    }
  };

  return (
    <AdminLayout title={fr ? 'Épargnes' : 'Savings'}>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label={fr ? 'Total épargné' : 'Total saved'} value={loading ? '…' : formatPrice(totalSaved)} accent />
        <StatCard label={fr ? 'En cours' : 'Active'} value={loading ? '…' : String(counts.active)} />
        <StatCard label={fr ? 'Suspendues' : 'Suspended'} value={loading ? '…' : String(counts.suspended)} />
        <StatCard label={fr ? 'Terminées' : 'Completed'} value={loading ? '…' : String(counts.completed)} />
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">{error}</div>
      )}

      {/* Status filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 mb-3">
        {(['all', ...STATUSES] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              statusFilter === f ? 'bg-[#007bff] text-white' : 'bg-white text-gray-600 border border-gray-100 hover:border-gray-200'
            }`}
          >
            {f === 'all' ? (fr ? 'Tous statuts' : 'All statuses') : statusLabel(f)} ({counts[f] ?? 0})
          </button>
        ))}
      </div>

      {/* Category (group) filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
        <button
          onClick={() => setGroupFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
            groupFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-100 hover:border-gray-200'
          }`}
        >
          {fr ? 'Toutes catégories' : 'All categories'}
        </button>
        {presentGroups.map((g) => (
          <button
            key={g}
            onClick={() => setGroupFilter(g)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              groupFilter === g ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-100 hover:border-gray-200'
            }`}
          >
            {groupLabel(g)} ({plans.filter((p) => p.product_group === g).length})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="w-10 px-3 py-3"></th>
                <th className="text-left font-bold px-5 py-3">{fr ? 'Client' : 'Customer'}</th>
                <th className="text-left font-bold px-5 py-3">{fr ? 'Produit' : 'Product'}</th>
                <th className="text-left font-bold px-5 py-3 w-56">{fr ? 'Progression' : 'Progress'}</th>
                <th className="text-left font-bold px-5 py-3 hidden lg:table-cell">{fr ? 'Échéance' : 'Due'}</th>
                <th className="text-right font-bold px-5 py-3">{fr ? 'Statut' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => {
                const pct = Math.min(100, Math.round((p.saved_amount / p.target_amount) * 100));
                const isOpen = expanded === p.id;
                return (
                  <React.Fragment key={p.id}>
                    <tr className="hover:bg-gray-50/50 align-top">
                      <td className="px-3 py-4">
                        <button
                          onClick={() => toggleHistory(p.id)}
                          className="p-1.5 text-gray-400 hover:text-[#007bff] hover:bg-blue-50 rounded-lg transition-all"
                          title={fr ? 'Historique des versements' : 'Payment history'}
                        >
                          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-gray-900">{p.user?.fullname || '—'}</p>
                        <p className="text-xs text-gray-400">{p.user?.email || '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {p.product_image && <img src={p.product_image} alt="" className="w-full h-full object-contain" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{p.product_name}</p>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider">{groupLabel(p.product_group)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                          <div
                            className={`h-full rounded-full ${p.status === 'completed' ? 'bg-emerald-500' : 'bg-[#007bff]'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatPrice(p.saved_amount)} / {formatPrice(p.target_amount)} · {pct}%
                        </p>
                      </td>
                      <td className="px-5 py-4 text-gray-500 hidden lg:table-cell whitespace-nowrap">
                        {p.target_date ? new Date(p.target_date).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLE[p.status]}`}>
                            {statusLabel(p.status)}
                          </span>
                          {p.status === 'cancelled' ? (
                            <div className="text-right max-w-[220px]">
                              {p.cancelled_at && (
                                <p className="text-[11px] text-gray-400">
                                  {new Date(p.cancelled_at).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                              )}
                              {p.cancellation_reason && (
                                <p className="text-xs text-gray-500 italic mt-0.5" title={p.cancellation_reason}>
                                  « {p.cancellation_reason} »
                                </p>
                              )}
                            </div>
                          ) : (
                            <>
                              <select
                                value={p.status}
                                disabled={busyId === p.id}
                                onChange={(e) => changeStatus(p, e.target.value as SavingsStatus)}
                                className="px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                              >
                                {TRANSITION_STATUSES.map((s) => (
                                  <option key={s} value={s}>{statusLabel(s)}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => openCancel(p)}
                                disabled={busyId === p.id}
                                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                              >
                                <Ban size={12} /> {fr ? 'Annuler' : 'Cancel'}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {isOpen && (
                      <tr className="bg-gray-50/40">
                        <td colSpan={6} className="px-5 py-4">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                            {fr ? 'Historique des versements' : 'Payment history'}
                            {history[p.id] ? ` (${history[p.id].length})` : ''}
                          </p>
                          {historyLoading === p.id ? (
                            <p className="text-sm text-gray-400">{fr ? 'Chargement…' : 'Loading…'}</p>
                          ) : !history[p.id] || history[p.id].length === 0 ? (
                            <p className="text-sm text-gray-400">{fr ? 'Aucun versement.' : 'No payment.'}</p>
                          ) : (
                            <ul className="divide-y divide-gray-100 max-w-xl">
                              {history[p.id].map((c) => (
                                <li key={c.id} className="flex items-center justify-between py-2">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center">
                                      <Wallet size={14} />
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-gray-900">{formatPrice(c.amount)}</p>
                                      <p className="text-xs text-gray-400">
                                        {new Date(c.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                                        {' · '}
                                        {new Date(c.created_at).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                    {c.method === 'simulated' ? (fr ? 'Simulé' : 'Simulated') : c.method}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    {fr ? 'Aucune épargne.' : 'No savings plans.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancellation confirmation modal */}
      {cancelTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !cancelBusy && setCancelTarget(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => !cancelBusy && setCancelTarget(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <X size={18} />
            </button>

            <div className="w-11 h-11 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle size={20} />
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-1">
              {fr ? "Annuler cette épargne ?" : 'Cancel this savings plan?'}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {fr
                ? 'Le plan passera à « Annulée » et le motif sera visible par le client. Le remboursement éventuel se gère hors-ligne.'
                : 'The plan will be set to “Cancelled” and the reason shown to the customer. Any refund is handled offline.'}
            </p>

            <div className="bg-gray-50 rounded-2xl p-4 mb-4 text-sm">
              <p className="font-bold text-gray-900">{cancelTarget.product_name}</p>
              <p className="text-gray-500">{cancelTarget.user?.fullname || cancelTarget.user?.email || '—'}</p>
              <p className="text-gray-500 mt-1">
                {fr ? 'Déjà épargné' : 'Already saved'}:{' '}
                <strong className="text-gray-900">{formatPrice(cancelTarget.saved_amount)}</strong>
                {' / '}
                {formatPrice(cancelTarget.target_amount)}
              </p>
            </div>

            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              {fr ? 'Motif (obligatoire)' : 'Reason (required)'}
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              autoFocus
              placeholder={fr ? 'Ex. : demande du client, produit indisponible…' : 'E.g. customer request, product unavailable…'}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setCancelTarget(null)}
                disabled={cancelBusy}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                {fr ? 'Retour' : 'Back'}
              </button>
              <button
                onClick={confirmCancel}
                disabled={cancelBusy || !cancelReason.trim()}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all disabled:opacity-50"
              >
                <Ban size={15} />
                {cancelBusy ? (fr ? 'Annulation…' : 'Cancelling…') : fr ? "Confirmer l'annulation" : 'Confirm cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-3xl p-5 border shadow-sm ${accent ? 'bg-[#007bff] text-white border-transparent' : 'bg-white border-gray-100'}`}>
      <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${accent ? 'text-blue-100' : 'text-gray-400'}`}>{label}</p>
      <p className={`text-xl font-black ${accent ? 'text-white' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}
