import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { Product, ProductGroup } from '@/src/constants';
import { fetchProducts } from '@/src/lib/catalog';

export type CatalogStatus = 'loading' | 'ready' | 'error';

interface CatalogContextType {
  products: Product[];
  status: CatalogStatus;
  /** Kept for convenience: true while the first (or a retried) load is running. */
  loading: boolean;
  /** Re-runs the fetch. Wired to the retry button of <CatalogState />. */
  reload: () => void;
  byGroup: (group: ProductGroup) => Product[];
  byId: (id: string) => Product | undefined;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

/**
 * The catalog comes from the database, and only from the database.
 *
 * There used to be a static fallback list (`PRODUCTS` in constants.ts) seeded
 * into state so the UI rendered instantly even without Supabase. In production
 * that was a liability, not a convenience: an unreachable database showed a
 * stale catalog with outdated prices and ids that exist nowhere ('1', '2', …),
 * and customers could order against it. A shop that cannot read its prices must
 * say so, not guess them.
 */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<CatalogStatus>('loading');
  const [attempt, setAttempt] = useState(0);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    fetchProducts()
      .then((list) => {
        if (!active) return;
        setProducts(list);
        setStatus('ready');
      })
      .catch(() => {
        if (!active) return;
        setProducts([]);
        setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const byGroup = (group: ProductGroup) => products.filter((p) => p.group === group);
  const byId = (id: string) => products.find((p) => p.id === id);

  return (
    <CatalogContext.Provider
      value={{ products, status, loading: status === 'loading', reload, byGroup, byId }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (context === undefined) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
}
