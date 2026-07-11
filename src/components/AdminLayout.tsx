import React, { useEffect, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Users, Settings, ShieldAlert } from 'lucide-react';
import Navbar from '@/src/components/Navbar';
import Seo from '@/src/components/Seo';
import { useAuth } from '@/src/contexts/AuthContext';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { cn } from '@/src/lib/utils';

export default function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const { currentUser, isAdmin, loading } = useAuth();
  const { language } = useLanguage();
  const fr = language === 'fr';
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to login once we know there's no session.
  useEffect(() => {
    if (!loading && !currentUser) navigate('/login');
  }, [loading, currentUser, navigate]);

  const nav = [
    { to: '/admin/products', label: fr ? 'Produits' : 'Products', icon: Package },
    { to: '/admin/orders', label: fr ? 'Commandes' : 'Orders', icon: ShoppingBag },
    { to: '/admin/users', label: fr ? 'Utilisateurs' : 'Users', icon: Users },
    { to: '/admin/settings', label: fr ? 'Réglages' : 'Settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        <div className="flex items-center justify-center py-32 text-gray-400">…</div>
      </div>
    );
  }

  if (!currentUser) return null; // redirecting

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-3">
            {fr ? 'Accès réservé' : 'Restricted area'}
          </h1>
          <p className="text-gray-500 mb-8">
            {fr
              ? "Cette section est réservée aux administrateurs."
              : 'This section is reserved for administrators.'}
          </p>
          <Link to="/" className="px-8 py-4 bg-[#007bff] text-white rounded-full font-bold hover:bg-blue-700 transition-all">
            {fr ? "Retour à l'accueil" : 'Back to home'}
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Seo title={`${title} · Admin`} />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-60 flex-shrink-0">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-3 lg:sticky lg:top-8">
            <p className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Admin</p>
            <nav className="flex lg:flex-col gap-1">
              {nav.map((item) => {
                const active = location.pathname === item.to || (item.to === '/admin/products' && location.pathname === '/admin');
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all',
                      active ? 'bg-[#007bff] text-white' : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}
