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

const COMPUTERS = [
  {
    id: '11',
    name: 'MacBook Pro M3 Max',
    price: 3499000,
    rating: 5.0,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1517336712468-077648f3efbc?w=400&h=400&fit=crop',
    category: 'Laptops'
  },
  {
    id: '12',
    name: 'Dell XPS 15',
    price: 1899000,
    rating: 4.8,
    reviews: 72,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop',
    category: 'Laptops'
  },
  {
    id: '13',
    name: 'ASUS ROG Zephyrus G14',
    price: 1599000,
    rating: 4.9,
    reviews: 88,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
    category: 'Gaming'
  },
  {
    id: '14',
    name: 'iMac 24-inch M3',
    price: 1299000,
    rating: 4.7,
    reviews: 31,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop',
    category: 'Desktops'
  }
];

export default function Computers() {
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
          <span className="text-gray-900 font-bold">{t('breadcrumb.computers')}</span>
        </nav>

        <header className="mb-6 md:mb-12">
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            {t('computers.title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-gray-500 max-w-2xl text-lg font-medium leading-relaxed">
            {t('computers.subtitle')}
          </motion.p>
        </header>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 md:mb-12">
          <FilterBar 
            filters={[]} 
            brandOptions={['HP', 'DELL', 'Asus', 'Mac', 'Lenovo']} 
            showAllFilters={false} 
            showSort={false} 
          />
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex-shrink-0">
            <button onClick={() => setViewMode('grid')} className={cn("p-2.5 rounded-xl transition-all", viewMode === 'grid' ? "bg-[#007bff] text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50")}><LayoutGrid size={20} /></button>
            <button onClick={() => setViewMode('list')} className={cn("p-2.5 rounded-xl transition-all", viewMode === 'list' ? "bg-[#007bff] text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50")}><List size={20} /></button>
          </div>
        </div>

        <div className={cn("grid gap-8", viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
          {COMPUTERS.map((product, index) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <ProductCard product={{ ...product, description: 'High-performance computing machine designed for professional workflows and immersive entertainment.' }} />
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
