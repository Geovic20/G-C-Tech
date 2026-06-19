export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  colors?: string[];
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
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'The ultimate iPhone with titanium design, A17 Pro chip, and advanced camera system.',
    price: 999000,
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500&h=500&fit=crop',
    category: 'Phones',
    colors: ['#2F2F2F', '#E3E2DE', '#BCC1D5', '#3C3A35'],
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
    colors: ['#2E2E2E', '#EAEAEA', '#F5E6CC', '#D1C4E9'],
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
    category: 'Phones'
  },
  {
    id: '11',
    name: 'MacBook Pro M3 Max',
    description: 'The most advanced chips ever built for a personal computer. Spectacular battery life.',
    price: 3499000,
    rating: 5.0,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1517336712468-077648f3efbc?w=500&h=500&fit=crop',
    category: 'Laptops',
    colors: ['#1C1C1C', '#E3E4E5'],
    specs: {
      Brand: 'Apple',
      Chip: 'M3 Max',
      RAM: 'Up to 128GB',
      Display: '14-inch or 16-inch Liquid Retina XDR'
    }
  },
  {
    id: '21',
    name: 'iPad Pro 12.9 M2',
    description: 'The ultimate iPad experience. Now with next-generation performance and a brilliant display.',
    price: 1099000,
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
    category: 'Tablets'
  },
  {
    id: '31',
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise cancellation. Spectacular sound quality and multi-point connection.',
    price: 349000,
    rating: 4.8,
    reviews: 210,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426ff472b?w=500&h=500&fit=crop',
    category: 'Headphones',
    colors: ['#000000', '#F5F5DC'],
    specs: {
      Brand: 'Sony',
      Connectivity: 'Bluetooth 5.2',
      'Battery Life': '30 hours',
      'Noise Canceling': 'Yes'
    }
  },
  {
    id: '51',
    name: 'Apple Watch Ultra 2',
    description: 'The most rugged and capable Apple Watch pushes the limits again.',
    price: 799000,
    rating: 4.9,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop',
    category: 'Watches'
  }
];
