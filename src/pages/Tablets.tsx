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

const TABLETS = [
  {
    id: '21',
    name: 'iPad Pro 12.9 M2',
    price: 1099000,
    rating: 4.9,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop',
    category: 'Tablets'
  },
  {
    id: '22',
    name: 'Samsung Galaxy Tab S9 Ultra',
    price: 1199000,
    rating: 4.8,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1561154464-82e9aff32764?w=400&h=400&fit=crop',
    category: 'Tablets'
  },
  {
    id: '23',
    name: 'Microsoft Surface Pro 9',
    price: 999000,
    rating: 4.6,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=400&h=400&fit=crop',
    category: 'Tablets'
  }
];

export default function Tablets() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-2 pb-12">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium">
          <Link to="/" className="hover:text-[#007bff] transition-colors">{t('breadcrumb.home')}</Link>
          <ChevronRight size={14} />
          <span>{t('breadcrumb.electronics')}</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-bold">{t('breadcrumb.tablets')}</span>
        </nav>

        <header className="mb-6 md:mb-12">
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            {t('tablets.title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-gray-500 max-w-2xl text-lg font-medium leading-relaxed">
            {t('tablets.subtitle')}
          </motion.p>
        </header>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 md:mb-12">
          <FilterBar 
            filters={[]} 
            brandOptions={['Samsung', 'Huawei', 'Xiaomi', 'iPad']} 
            showAllFilters={false} 
            showSort={false} 
          />
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex-shrink-0">
            <button onClick={() => setViewMode('grid')} className={cn("p-2.5 rounded-xl transition-all", viewMode === 'grid' ? "bg-[#007bff] text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50")}><LayoutGrid size={20} /></button>
            <button onClick={() => setViewMode('list')} className={cn("p-2.5 rounded-xl transition-all", viewMode === 'list' ? "bg-[#007bff] text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50")}><List size={20} /></button>
          </div>
        </div>

        <div className={cn("grid gap-8", viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
          {TABLETS.map((product, index) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <ProductCard product={{ ...product, description: 'Versatile and portable touchscreen devices for creative work and streaming on the go.' }} />
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
