import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product, PRODUCTS, ProductGroup } from '@/src/constants';
import { fetchProducts } from '@/src/lib/catalog';

interface CatalogContextType {
  products: Product[];
  loading: boolean;
  /** Source of the data currently shown: live DB or the static fallback. */
  source: 'db' | 'fallback';
  byGroup: (group: ProductGroup) => Product[];
  byId: (id: string) => Product | undefined;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export function CatalogProvider({ children }: { children: ReactNode }) {
  // Start from the static catalog so the UI renders instantly and never breaks,
  // even if Supabase isn't configured yet. Swap to live data once it loads.
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'db' | 'fallback'>('fallback');

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((list) => {
        if (active && list.length > 0) {
          setProducts(list);
          setSource('db');
        }
      })
      .catch(() => {
        /* keep the static fallback */
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const byGroup = (group: ProductGroup) => products.filter((p) => p.group === group);
  const byId = (id: string) => products.find((p) => p.id === id);

  return (
    <CatalogContext.Provider value={{ products, loading, source, byGroup, byId }}>
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
