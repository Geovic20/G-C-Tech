import React, { useState } from 'react';
import Navbar from '@/src/components/Navbar';
import ProductCard from '@/src/components/ProductCard';
import FilterBar from '@/src/components/FilterBar';
import { getProductsByGroup } from '@/src/constants';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { motion } from 'motion/react';
import { ChevronRight, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';


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
          {getProductsByGroup('smartphones').map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Empty State / Pagination Simulation */}
        <div className="mt-20 text-center">
          <button className="px-10 py-5 bg-white border border-gray-100 rounded-full font-black text-gray-900 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all uppercase tracking-widest text-sm">
            {t('products.load-more')}
          </button>
        </div>
      </main>

    </div>
  );
}
