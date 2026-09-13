import { ReactNode } from 'react';
import { PackageX, RefreshCw, Loader2 } from 'lucide-react';
import { useCatalog } from '@/src/contexts/CatalogContext';
import { useLanguage } from '@/src/contexts/LanguageContext';

/**
 * Wraps any part of the shop that lists products.
 *
 * The catalog has no static fallback any more, so every listing page needs to
 * say what is happening rather than render an empty grid: still loading, the
 * database could not be reached (with a retry), or genuinely nothing here.
 *
 *   <CatalogState count={items.length}>
 *     …the grid…
 *   </CatalogState>
 */
export default function CatalogState({
  count,
  children,
}: {
  /** How many products the caller is about to render. */
  count: number;
  children: ReactNode;
}) {
  const { status, reload } = useCatalog();
  const { language } = useLanguage();
  const fr = language === 'fr';

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
        <Loader2 size={28} className="animate-spin text-[#007bff]" />
        <p className="text-sm font-medium">{fr ? 'Chargement du catalogue…' : 'Loading the catalog…'}</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm px-6 py-16 text-center">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-5">
          <PackageX size={30} />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">
          {fr ? 'Catalogue momentanément indisponible' : 'Catalog temporarily unavailable'}
        </h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
          {fr
            ? "Nous n'arrivons pas à charger nos produits pour l'instant. Plutôt que de vous montrer des prix qui pourraient être faux, nous préférons ne rien afficher. Réessayez dans un instant."
            : 'We cannot load our products right now. Rather than show you prices that might be wrong, we prefer to show nothing. Please try again in a moment.'}
        </p>
        <button
          onClick={reload}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#007bff] text-white rounded-full font-bold hover:bg-blue-700 transition-all"
        >
          <RefreshCw size={18} />
          {fr ? 'Réessayer' : 'Try again'}
        </button>
      </div>
    );
  }

  if (count === 0) {
    return (
      <p className="text-center text-gray-500 py-20">
        {fr ? 'Aucun produit dans cette catégorie pour le moment.' : 'No product in this category yet.'}
      </p>
    );
  }

  return <>{children}</>;
}
