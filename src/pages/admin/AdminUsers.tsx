import React, { useEffect, useState } from 'react';
import { Shield, User as UserIcon } from 'lucide-react';
import AdminLayout from '@/src/components/AdminLayout';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { adminListUsers, adminSetUserRole, AdminUser, UserRole } from '@/src/lib/admin';

export default function AdminUsers() {
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  const fr = language === 'fr';
  const locale = fr ? 'fr-FR' : 'en-US';

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setError('');
    try {
      setUsers(await adminListUsers());
    } catch (e: any) {
      setError(e?.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (u: AdminUser, role: UserRole) => {
    setBusyId(u.id);
    const result = await adminSetUserRole(u.id, role);
    setBusyId(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role } : x)));
  };

  const adminsCount = users.filter((u) => u.role === 'admin').length;

  return (
    <AdminLayout title={fr ? 'Utilisateurs' : 'Users'}>
      <p className="text-gray-500 text-sm mb-6">
        {loading ? '…' : `${users.length} ${fr ? 'utilisateurs' : 'users'} · ${adminsCount} admin${adminsCount > 1 ? 's' : ''}`}
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">{error}</div>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left font-bold px-5 py-3">{fr ? 'Utilisateur' : 'User'}</th>
                <th className="text-left font-bold px-5 py-3 hidden md:table-cell">{fr ? 'Téléphone' : 'Phone'}</th>
                <th className="text-left font-bold px-5 py-3 hidden sm:table-cell">{fr ? 'Inscrit le' : 'Joined'}</th>
                <th className="text-right font-bold px-5 py-3">{fr ? 'Rôle' : 'Role'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => {
                const isSelf = !!currentUser && currentUser.email === u.email;
                return (
                  <tr key={u.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${u.role === 'admin' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {u.role === 'admin' ? <Shield size={16} /> : <UserIcon size={16} />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate">
                            {u.fullname || '—'} {isSelf && <span className="text-xs font-medium text-gray-400">({fr ? 'vous' : 'you'})</span>}
                          </p>
                          <p className="text-gray-500 text-xs truncate">{u.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{u.phone || '—'}</td>
                    <td className="px-5 py-3 text-gray-500 hidden sm:table-cell whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end">
                        <select
                          value={u.role}
                          disabled={isSelf || busyId === u.id}
                          onChange={(e) => changeRole(u, e.target.value as UserRole)}
                          title={isSelf ? (fr ? 'Vous ne pouvez pas changer votre propre rôle' : "You can't change your own role") : ''}
                          className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#007bff] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="customer">{fr ? 'Client' : 'Customer'}</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-gray-400">
                    {fr ? 'Aucun utilisateur.' : 'No users.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        {fr
          ? 'Astuce : vous ne pouvez pas modifier votre propre rôle (sécurité anti-verrouillage).'
          : 'Tip: you cannot change your own role (anti-lockout safety).'}
      </p>
    </AdminLayout>
  );
}
