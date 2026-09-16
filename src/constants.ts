export type ProductGroup =
  | 'smartphones'
  | 'computers'
  | 'tablets'
  | 'headphones'
  | 'earphones'
  | 'smartwatches';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  /** High-level group matching a catalog page / route. */
  group: ProductGroup;
  /** Marque, telle qu'enregistree en base. */
  brand?: string;
  /** False when the product is out of stock. */
  inStock?: boolean;
  specs?: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  /** Groupe catalogue correspondant, pour compter les produits reels. */
  group: ProductGroup;
  image: string;
  color: string;
  link: string;
}

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Smartphones', group: 'smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=400&fit=crop', color: '#F5F6F6', link: '/smartphones' },
  { id: '2', name: 'Ordinateurs', group: 'computers', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=400&fit=crop', color: '#F5F6F6', link: '/computers' },
  { id: '3', name: 'Tablettes', group: 'tablets', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=400&fit=crop', color: '#F5F6F6', link: '/tablets' },
  { id: '4', name: 'Casques', group: 'headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=400&fit=crop', color: '#F5F6F6', link: '/headphones' },
  { id: '5', name: 'Ecouteurs', group: 'earphones', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=400&fit=crop', color: '#F5F6F6', link: '/earphones' },
  { id: '6', name: 'Montres connectées', group: 'smartwatches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop', color: '#F5F6F6', link: '/smartwatches' }
];
