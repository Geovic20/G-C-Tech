import { useMemo, useState } from 'react';
import { Product, ProductGroup } from '@/src/constants';
import { useCatalog } from '@/src/contexts/CatalogContext';

export type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name';

/**
 * Brand filtering and sorting for a category page.
 *
 * The brand list is derived from the products actually present in the group —
 * it can never offer a brand that yields no result, which is what the old
 * hardcoded lists did (they even offered "iPad" and "Airpod" as brands).
 */
export function useProductFilters(group: ProductGroup) {
  const { byGroup } = useCatalog();
  const all = byGroup(group);

  const [brand, setBrand] = useState('');
  const [sort, setSort] = useState<SortKey>('default');

  const brands = useMemo(
    () =>
      Array.from(new Set(all.map((p) => p.brand).filter((b): b is string => !!b))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [all]
  );

  const items = useMemo(() => {
    const filtered = brand ? all.filter((p) => p.brand === brand) : all;
    const sorted: Product[] = [...filtered];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [all, brand, sort]);

  return { items, brands, brand, setBrand, sort, setSort, total: all.length };
}
