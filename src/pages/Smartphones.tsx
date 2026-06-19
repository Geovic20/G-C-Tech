import React, { useState } from 'react';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import ProductCard from '@/src/components/ProductCard';
import FilterBar from '@/src/components/FilterBar';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { motion } from 'motion/react';
import { ChevronRight, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

const SMARTPHONES = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 999000,
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&h=400&fit=crop',
    category: 'Phones'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    price: 1299000,
    rating: 4.8,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
    category: 'Phones'
  },
  {
    id: '3',
    name: 'Google Pixel 8 Pro',
    price: 899000,
    rating: 4.7,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    category: 'Phones'
  },
  {
    id: '4',
    name: 'OnePlus 12',
    price: 799000,
    rating: 4.6,
    reviews: 84,
    image: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=400&h=400&fit=crop',
    category: 'Phones'
  },
  {
    id: '5',
    name: 'Xiaomi 14 Ultra',
    price: 1199000,
    rating: 4.8,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    category: 'Phones'
  },
  {
    id: '6',
    name: 'Nothing Phone (2)',
    price: 599000,
    rating: 4.5,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&h=400&fit=crop',
    category: 'Phones'
  }
];

export default function Smartphones() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-2 pb-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium">
          <Link to="/" className="hover:text-[#007bff] transition-colors">{t('breadcrumb.home')}</Link>
          <ChevronRight size={14} />
          <span>{t('breadcrumb.electronics')}</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-bold">{t('breadcrumb.smartphones')}</span>
        </nav>

        {/* Header */}
        <header className="mb-6 md:mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight"
          >
            {t('smartphones.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-2xl text-lg font-medium leading-relaxed"
          >
            {t('smartphones.subtitle')}
          </motion.p>
        </header>

        {/* Filters & View Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 md:mb-12">
          <FilterBar 
            filters={[]}
            brandOptions={['Apple', 'Samsung', 'Tecno', 'Huawei', 'iNFINIX', 'Google Pixel']}
            showAllFilters={false}
            showSort={false}
          />
          
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex-shrink-0">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                viewMode === 'grid' ? "bg-[#007bff] text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              )}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                viewMode === 'list' ? "bg-[#007bff] text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              )}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className={cn(
          "grid gap-8",
          viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {SMARTPHONES.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={{ ...product, description: 'Latest tech flagship with premium build and cutting edge camera system.' }} />
            </motion.div>
          ))}
        </div>

        {/* Empty State / Pagination Simulation */}
        <div className="mt-20 text-center">
          <button className="px-10 py-5 bg-white border border-gray-100 rounded-full font-black text-gray-900 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all uppercase tracking-widest text-sm">
            Load More Products
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
