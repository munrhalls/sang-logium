"use client";

import { useState } from "react";
import { mockFilterOptions } from "./mockData";

interface ProductsFilterSidebarProps {
  onApplyFilters: (filters: Record<string, any>) => void;
}

/**
 * Simplified sidebar with filters for the standalone products page
 */
export default function ProductsFilterSidebar({ onApplyFilters }: ProductsFilterSidebarProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Handle filter value changes
  const handleFilterChange = (name: string, value: any) => {
    setActiveFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle price range changes
  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value, 10) : undefined;
    setPriceRange(prev => ({
      ...prev,
      [type]: numValue
    }));
    
    handleFilterChange('price', {
      ...priceRange,
      [type]: numValue
    });
  };

  // Handle brand selection
  const handleBrandChange = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    
    setSelectedBrands(newBrands);
    handleFilterChange('brand', newBrands);
  };

  // Handle type selection
  const handleTypeChange = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    
    setSelectedTypes(newTypes);
    handleFilterChange('type', newTypes);
  };

  // Apply all filters
  const applyFilters = () => {
    onApplyFilters(activeFilters);
  };

  // Reset all filters
  const resetFilters = () => {
    setPriceRange({});
    setSelectedBrands([]);
    setInStock(false);
    setSelectedTypes([]);
    setActiveFilters({});
    onApplyFilters({});
  };

  // Get filter options
  const brandOptions = mockFilterOptions.find(f => f.name === 'brand')?.options || [];
  const typeOptions = mockFilterOptions.find(f => f.name === 'type')?.options || [];
  const priceFilter = mockFilterOptions.find(f => f.name === 'price');

  return (
    <div className="bg-blue-950 shadow-xl text-white rounded-lg p-4 mb-4">
      <h2 className="text-xl font-semibold mb-4 border-b border-blue-800 pb-2">Filters</h2>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Price Range</h3>
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="text-sm text-gray-300">Min</label>
            <input 
              type="number"
              value={priceRange.min || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              placeholder="Min"
              min={priceFilter?.min || 0}
              max={priceFilter?.max || 1000}
              className="w-full p-2 bg-blue-900 text-white rounded border border-blue-700"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm text-gray-300">Max</label>
            <input 
              type="number"
              value={priceRange.max || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              placeholder="Max"
              min={priceFilter?.min || 0}
              max={priceFilter?.max || 1000}
              className="w-full p-2 bg-blue-900 text-white rounded border border-blue-700"
            />
          </div>
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Brand</h3>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {brandOptions.map((brand) => (
            <div key={brand} className="flex items-center">
              <input
                type="checkbox"
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="mr-2"
              />
              <label htmlFor={`brand-${brand}`} className="text-sm">{brand}</label>
            </div>
          ))}
        </div>
      </div>

      {/* In Stock Filter */}
      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="inStock"
            checked={inStock}
            onChange={() => {
              setInStock(!inStock);
              handleFilterChange('inStock', !inStock);
            }}
            className="mr-2"
          />
          <label htmlFor="inStock">In Stock Only</label>
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Type</h3>
        <div className="space-y-1">
          {typeOptions.map((type) => (
            <div key={type} className="flex items-center">
              <input
                type="checkbox"
                id={`type-${type}`}
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
                className="mr-2"
              />
              <label htmlFor={`type-${type}`} className="text-sm">{type}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Action Buttons */}
      <div className="flex space-x-2 mt-6">
        <button
          onClick={applyFilters}
          className="flex-1 py-2 px-3 bg-blue-700 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={resetFilters}
          className="flex-1 py-2 px-3 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}