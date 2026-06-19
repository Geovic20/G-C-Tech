import React from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  filters?: string[];
  brandOptions?: string[];
  showSort?: boolean;
  showAllFilters?: boolean;
  onBrandChange?: (brand: string) => void;
}

export default function FilterBar({ 
  filters = [],
  brandOptions = [],
  showSort = true,
  showAllFilters = true,
  onBrandChange
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 md:py-6 w-full overflow-hidden">
      <div className="flex items-center gap-2 overflow-x-auto w-full no-scrollbar pb-1 sm:pb-0">
        {brandOptions.length > 0 && (
          <div className="relative group">
            <select 
              onChange={(e) => onBrandChange?.(e.target.value)}
              className="appearance-none flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#f5f6f6] rounded-full text-xs sm:text-sm font-bold whitespace-nowrap hover:bg-gray-200 transition-all cursor-pointer pr-8 sm:pr-10 border-none outline-none focus:ring-2 focus:ring-[#007bff]/20"
            >
              <option value="">Marque</option>
              {brandOptions.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
          </div>
        )}

        {filters.map((filter) => (
          <button
            key={filter}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#f5f6f6] rounded-full text-xs sm:text-sm font-bold whitespace-nowrap hover:bg-gray-200 transition-all"
          >
            {filter} <ChevronDown size={14} />
          </button>
        ))}
        
        {showAllFilters && (
          <button className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#f5f6f6] rounded-full text-xs sm:text-sm font-bold whitespace-nowrap hover:bg-gray-200 transition-all">
            All Filters <SlidersHorizontal size={14} />
          </button>
        )}
      </div>

      {showSort && (
        <div className="flex items-center gap-2 bg-[#f5f6f6] rounded-full px-4 sm:px-6 py-2 sm:py-2.5 min-w-[100px] sm:min-w-[120px] cursor-pointer hover:bg-gray-200 transition-all">
          <span className="text-xs sm:text-sm font-bold whitespace-nowrap text-gray-900">Sort by</span>
          <ChevronDown size={14} className="text-gray-900" />
        </div>
      )}
    </div>
  );
}
