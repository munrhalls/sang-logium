"use client";

import { useState } from "react";
import ProductsFilterSidebar from "./ProductsFilterSidebar";
import ProductsSortControls from "./ProductsSortControls";

interface ProductsPageControlsProps {
  onFiltersChange: (filters: Record<string, any>) => void;
  onSortChange: (field: string, direction: 'asc' | 'desc') => void;
}

/**
 * Combined filter and sort controls with toggle functionality
 */
export default function ProductsPageControls({ 
  onFiltersChange,
  onSortChange
}: ProductsPageControlsProps) {
  const [activeView, setActiveView] = useState<'filters' | 'sort'>('filters');

  return (
    <div className="bg-blue-950 shadow-xl text-white rounded-lg overflow-hidden">
      {/* Toggle buttons */}
      <div className="flex">
        <button
          onClick={() => setActiveView('filters')}
          className={`flex-1 py-3 px-4 text-center text-sm uppercase font-semibold tracking-wide ${
            activeView === 'filters'
              ? 'bg-blue-800 text-white'
              : 'bg-gray-700 text-gray-200'
          }`}
        >
          Filters
        </button>
        <button
          onClick={() => setActiveView('sort')}
          className={`flex-1 py-3 px-4 text-center text-sm uppercase font-semibold tracking-wide ${
            activeView === 'sort'
              ? 'bg-blue-800 text-white'
              : 'bg-gray-700 text-gray-200'
          }`}
        >
          Sort
        </button>
      </div>

      {/* Content area */}
      <div className="p-4">
        {activeView === 'filters' ? (
          <ProductsFilterSidebar onApplyFilters={onFiltersChange} />
        ) : (
          <ProductsSortControls onSortChange={onSortChange} />
        )}
      </div>
    </div>
  );
}