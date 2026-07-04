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
  specs?: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  itemsCount: number;
  image: string;
  color: string;
  link: string;
}

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Smartphones', itemsCount: 240, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=400&fit=crop', color: '#F5F6F6', link: '/smartphones' },
  { id: '2', name: 'Ordinateurs', itemsCount: 240, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=400&fit=crop', color: '#F5F6F6', link: '/computers' },
  { id: '3', name: 'Tablettes', itemsCount: 240, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=400&fit=crop', color: '#F5F6F6', link: '/tablets' },
  { id: '4', name: 'Casques', itemsCount: 240, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=400&fit=crop', color: '#F5F6F6', link: '/headphones' },
  { id: '5', name: 'Ecouteurs', itemsCount: 240, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=400&fit=crop', color: '#F5F6F6', link: '/earphones' },
  { id: '6', name: 'Montres connectées', itemsCount: 240, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop', color: '#F5F6F6', link: '/smartwatches' }
];

export const PRODUCTS: Product[] = [
  // ----- Smartphones -----
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system.',
    price: 999000,
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500&h=500&fit=crop',
    category: 'Phones',
    group: 'smartphones',
    specs: {
      Brand: 'Apple',
      Chip: 'A17 Pro',
      Display: '6.1-inch Super Retina XDR',
      Camera: '48MP Main | Ultra Wide | Telephoto',
      Battery: 'Up to 23 hours video playback'
    }
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Experience the next level of mobile technology with Galaxy AI and the powerful S Pen.',
    price: 1299000,
    rating: 4.8,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop',
    category: 'Phones',
    group: 'smartphones',
    specs: {
      Brand: 'Samsung',
      Chip: 'Snapdragon 8 Gen 3',
      Display: '6.8-inch QHD+ Dynamic AMOLED 2X',
      Camera: '200MP Main | 50MP Telephoto',
      Battery: '5000 mAh'
    }
  },
  {
    id: '3',
    name: 'Google Pixel 8 Pro',
    description: 'The all-pro phone engineered by Google with the best Pixel camera yet.',
    price: 899000,
    rating: 4.7,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop',
    category: 'Phones',
    group: 'smartphones'
  },
  {
    id: '4',
    name: 'OnePlus 12',
    description: 'Flagship performance with a fluid display and ultra-fast charging.',
    price: 799000,
    rating: 4.6,
    reviews: 84,
    image: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=500&h=500&fit=crop',
    category: 'Phones',
    group: 'smartphones'
  },
  {
    id: '5',
    name: 'Xiaomi 14 Ultra',
    description: 'Pro-grade Leica optics meet powerful performance in a premium build.',
    price: 1199000,
    rating: 4.8,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
    category: 'Phones',
    group: 'smartphones'
  },
  {
    id: '6',
    name: 'Nothing Phone (2)',
    description: 'A unique design with the Glyph interface and clean, fast software.',
    price: 599000,
    rating: 4.5,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=500&h=500&fit=crop',
    category: 'Phones',
    group: 'smartphones'
  },

  // ----- Computers -----
  {
    id: '11',
    name: 'MacBook Pro M3 Max',
    description: 'The most advanced chips ever built for a personal computer. Spectacular battery life.',
    price: 3499000,
    rating: 5.0,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1517336712468-077648f3efbc?w=500&h=500&fit=crop',
    category: 'Laptops',
    group: 'computers',
    specs: {
      Brand: 'Apple',
      Chip: 'M3 Max',
      RAM: 'Up to 128GB',
      Display: '14-inch or 16-inch Liquid Retina XDR'
    }
  },
  {
    id: '12',
    name: 'Dell XPS 15',
    description: 'A premium Windows laptop with a stunning InfinityEdge display.',
    price: 1899000,
    rating: 4.8,
    reviews: 72,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop',
    category: 'Laptops',
    group: 'computers'
  },
  {
    id: '13',
    name: 'ASUS ROG Zephyrus G14',
    description: 'A compact powerhouse built for high-end gaming and creative workloads.',
    price: 1599000,
    rating: 4.9,
    reviews: 88,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop',
    category: 'Gaming',
    group: 'computers'
  },
  {
    id: '14',
    name: 'iMac 24-inch M3',
    description: 'A strikingly thin all-in-one desktop with a vibrant 4.5K Retina display.',
    price: 1299000,
    rating: 4.7,
    reviews: 31,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop',
    category: 'Desktops',
    group: 'computers'
  },

  // ----- Tablets -----
  {
    id: '21',
    name: 'iPad Pro 12.9 M2',
    description: 'The ultimate iPad experience. Now with next-generation performance and a brilliant display.',
    price: 1099000,
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
    category: 'Tablets',
    group: 'tablets'
  },
  {
    id: '22',
    name: 'Samsung Galaxy Tab S9 Ultra',
    description: 'A massive AMOLED display and S Pen support for work and play.',
    price: 1199000,
    rating: 4.8,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1561154464-82e9aff32764?w=500&h=500&fit=crop',
    category: 'Tablets',
    group: 'tablets'
  },
  {
    id: '23',
    name: 'Microsoft Surface Pro 9',
    description: 'The versatile 2-in-1 that is a tablet and a laptop in one device.',
    price: 999000,
    rating: 4.6,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=500&h=500&fit=crop',
    category: 'Tablets',
    group: 'tablets'
  },

  // ----- Headphones -----
  {
    id: '31',
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise cancellation. Spectacular sound quality and multi-point connection.',
    price: 349000,
    rating: 4.8,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426ff472b?w=500&h=500&fit=crop',
    category: 'Headphones',
    group: 'headphones',
    specs: {
      Brand: 'Sony',
      Connectivity: 'Bluetooth 5.2',
      'Battery Life': '30 hours',
      'Noise Canceling': 'Yes'
    }
  },
  {
    id: '32',
    name: 'Bose QuietComfort Ultra',
    description: 'World-class noise cancellation with immersive spatial audio.',
    price: 379000,
    rating: 4.9,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category: 'Headphones',
    group: 'headphones'
  },
  {
    id: '33',
    name: 'AirPods Max',
    description: 'High-fidelity audio with Active Noise Cancellation and a premium design.',
    price: 549000,
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=500&h=500&fit=crop',
    category: 'Headphones',
    group: 'headphones'
  },

  // ----- Earphones -----
  {
    id: '41',
    name: 'AirPods Pro (2nd Gen)',
    description: 'Next-level Active Noise Cancellation and Adaptive Transparency.',
    price: 249000,
    rating: 4.9,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1588423770186-80f336a04b71?w=500&h=500&fit=crop',
    category: 'Earphones',
    group: 'earphones'
  },
  {
    id: '42',
    name: 'Sony WF-1000XM5',
    description: 'The best truly wireless earbuds for noise cancellation and sound quality.',
    price: 299000,
    rating: 4.8,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop',
    category: 'Earphones',
    group: 'earphones'
  },
  {
    id: '43',
    name: 'Samsung Galaxy Buds2 Pro',
    description: 'Compact earbuds with intelligent ANC and 360 Audio.',
    price: 199000,
    rating: 4.7,
    reviews: 86,
    image: 'https://images.unsplash.com/photo-1590658006244-85710daaff1a?w=500&h=500&fit=crop',
    category: 'Earphones',
    group: 'earphones'
  },

  // ----- Smartwatches -----
  {
    id: '51',
    name: 'Apple Watch Ultra 2',
    description: 'The most rugged and capable Apple Watch pushes the limits again.',
    price: 799000,
    rating: 4.9,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop',
    category: 'Watches',
    group: 'smartwatches'
  },
  {
    id: '52',
    name: 'Samsung Galaxy Watch6 Classic',
    description: 'A timeless design with a rotating bezel and advanced health tracking.',
    price: 399000,
    rating: 4.7,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    category: 'Watches',
    group: 'smartwatches'
  },
  {
    id: '53',
    name: 'Garmin Epix Gen 2',
    description: 'A premium multisport GPS smartwatch with a brilliant AMOLED display.',
    price: 899000,
    rating: 4.8,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1508685096489-7aac29a21244?w=500&h=500&fit=crop',
    category: 'Watches',
    group: 'smartwatches'
  }
];

/** Returns all products belonging to a given catalog group. */
export function getProductsByGroup(group: ProductGroup): Product[] {
  return PRODUCTS.filter((p) => p.group === group);
}
