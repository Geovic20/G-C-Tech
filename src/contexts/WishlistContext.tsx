import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { listWishlist, addWishlist, removeWishlist } from '@/src/lib/wishlist';

interface WishlistContextType {
  ids: string[];
  count: number;
  loading: boolean;
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [set, setSet] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setSet(new Set());
      return;
    }
    let active = true;
    setLoading(true);
    listWishlist()
      .then((ids) => {
        if (active) setSet(new Set(ids));
      })
      .catch(() => {
        /* ignore */
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [currentUser]);

  const isFavorite = (id: string) => set.has(id);

  const toggle = async (id: string) => {
    if (!currentUser) return;
    const has = set.has(id);
    // Optimistic update.
    setSet((prev) => {
      const next = new Set(prev);
      if (has) next.delete(id);
      else next.add(id);
      return next;
    });
    const result = has ? await removeWishlist(id) : await addWishlist(id);
    if (result.error) {
      // Revert on failure.
      setSet((prev) => {
        const next = new Set(prev);
        if (has) next.add(id);
        else next.delete(id);
        return next;
      });
    }
  };

  const ids = Array.from(set);

  return (
    <WishlistContext.Provider value={{ ids, count: ids.length, loading, isFavorite, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
