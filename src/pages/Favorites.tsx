import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Navbar from '@/src/components/Navbar';
import Seo from '@/src/components/Seo';
import ProductCard from '@/src/components/ProductCard';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { useWishlist } from '@/src/contexts/WishlistContext';
import { useCatalog } from '@/src/contexts/CatalogContext';

export default function Favorites() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const { currentUser, loading: authLoading } = useAuth();
  const { ids, loading: wLoading } = useWishlist();
  const { byId, loading: catalogLoading } = useCatalog();

  const products = ids.map((id) => byId(id)).filter(Boolean);
  const loading = wLoading || catalogLoading;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <Seo title={fr ? 'Favoris' : 'Wishlist'} />

      <main className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
            <Heart size={22} fill="currentColor" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">{fr ? 'Mes favoris' : 'My wishlist'}</h1>
        </div>

        {!authLoading && !currentUser ? (
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-10 text-center">
            <p className="text-gray-500 mb-6">
              {fr ? 'Connectez-vous pour retrouver vos produits favoris.' : 'Sign in to see your favorite products.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/login" className="px-8 py-4 bg-[#007bff] text-white rounded-full font-bold hover:bg-blue-700 transition-all">
                {fr ? 'Se connecter' : 'Sign in'}
              </Link>
              <Link to="/products" className="px-8 py-4 border border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-all">
                {fr ? 'Parcourir le catalogue' : 'Browse the catalog'}
              </Link>
            </div>
          </div>
        ) : loading ? (
          <p className="text-gray-400">{fr ? 'Chargement…' : 'Loading…'}</p>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-gray-500 mb-6">
              {fr ? "Vous n'avez pas encore de favoris." : 'You have no favorites yet.'}
            </p>
            <Link to="/products" className="inline-flex px-8 py-4 bg-[#007bff] text-white rounded-full font-bold hover:bg-blue-700 transition-all">
              {fr ? 'Découvrir les produits' : 'Discover products'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product!.id} product={product!} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
