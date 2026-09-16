import { ChevronDown, X } from 'lucide-react';
import { useLanguage } from '@/src/contexts/LanguageContext';
import type { SortKey } from '@/src/hooks/useProductFilters';

interface FilterBarProps {
  /** Brands actually present in the listing — never a hardcoded list. */
  brands: string[];
  brand: string;
  onBrandChange: (brand: string) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  /** Number of products currently shown, for the "N résultats" counter. */
  count: number;
}

/**
 * Brand filter and sort for the category pages.
 *
 * Every control here does something. The previous version rendered a brand
 * select whose `onBrandChange` no page ever passed, plus an "All filters"
 * button and a "Sort" control with no handler at all — visitors clicked and
 * nothing happened.
 */
export default function FilterBar({
  brands,
  brand,
  onBrandChange,
  sort,
  onSortChange,
  count,
}: FilterBarProps) {
  const { language } = useLanguage();
  const fr = language === 'fr';

  const sortLabels: Record<SortKey, string> = fr
    ? {
        default: 'Tri : par défaut',
        'price-asc': 'Prix croissant',
        'price-desc': 'Prix décroissant',
        name: 'Nom (A–Z)',
      }
    : {
        default: 'Sort: default',
        'price-asc': 'Price: low to high',
        'price-desc': 'Price: high to low',
        name: 'Name (A–Z)',
      };

  const selectCls =
    'appearance-none px-4 sm:px-6 py-2 sm:py-2.5 bg-[#f5f6f6] rounded-full text-xs sm:text-sm ' +
    'font-bold whitespace-nowrap hover:bg-gray-200 transition-all cursor-pointer pr-9 ' +
    'border-none outline-none focus:ring-2 focus:ring-[#007bff]/40';

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 py-2 md:py-6 w-full">
      <div className="flex items-center gap-2 flex-wrap">
        {brands.length > 1 && (
          <div className="relative">
            <select
              value={brand}
              onChange={(e) => onBrandChange(e.target.value)}
              aria-label={fr ? 'Filtrer par marque' : 'Filter by brand'}
              className={selectCls}
            >
              <option value="">{fr ? 'Toutes les marques' : 'All brands'}</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
            />
          </div>
        )}

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            aria-label={fr ? 'Trier les produits' : 'Sort products'}
            className={selectCls}
          >
            {(Object.keys(sortLabels) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {sortLabels[key]}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
          />
        </div>

        {brand && (
          <button
            onClick={() => onBrandChange('')}
            className="inline-flex items-center gap-1.5 px-4 py-2 sm:py-2.5 bg-blue-50 text-[#007bff] rounded-full text-xs sm:text-sm font-bold hover:bg-blue-100 transition-all"
          >
            {brand}
            <X size={14} />
            <span className="sr-only">{fr ? 'Retirer le filtre' : 'Clear filter'}</span>
          </button>
        )}
      </div>

      <span className="text-xs sm:text-sm text-gray-400 font-medium sm:ml-auto whitespace-nowrap">
        {count} {fr ? (count > 1 ? 'produits' : 'produit') : count > 1 ? 'products' : 'product'}
      </span>
    </div>
  );
}
