"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon, FunnelIcon, ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { mockProducts } from "./components/mockData";
import ProductsPageControls from "./components/ProductsPageControls";
import Pagination from "./components/Pagination";
import ProductSkeletonCard from "./components/ProductSkeletonCard";
import ProductThumb from "../components/features/products-view/ProductThumb";

// Mock image URL function for testing
const mockImageUrl = (image: any) => ({
  url: () => "https://placehold.co/300x300/gray/white?text=Product+Image"
});

/**
 * Standalone Products page with minimal UI components
 */
export default function ProductsPage() {
  // State for filtering, sorting, and pagination
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  
  // Settings
  const productsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Apply filters and sorting whenever they change
  useEffect(() => {
    // Reset to first page when filters or sorting changes
    setCurrentPage(1);
    
    // Simulate API request with delay
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      let filtered = [...mockProducts];
      
      // Apply filters (simple implementation)
      if (activeFilters.brand?.length) {
        filtered = filtered.filter(p => 
          activeFilters.brand.includes(p.brand)
        );
      }
      
      if (activeFilters.price?.min) {
        filtered = filtered.filter(p => 
          (p.price || 0) >= activeFilters.price.min
        );
      }
      
      if (activeFilters.price?.max) {
        filtered = filtered.filter(p => 
          (p.price || 0) <= activeFilters.price.max
        );
      }
      
      if (activeFilters.inStock) {
        filtered = filtered.filter(p => 
          (p.stock || 0) > 0
        );
      }
      
      // Apply sorting
      if (sortField) {
        filtered.sort((a, b) => {
          const aValue = a[sortField as keyof typeof a];
          const bValue = b[sortField as keyof typeof b];
          
          if (aValue === undefined || bValue === undefined) return 0;
          
          // For price and numeric fields
          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortDirection === 'asc' 
              ? aValue - bValue 
              : bValue - aValue;
          }
          
          // For string fields
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortDirection === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }
          
          return 0;
        });
      }
      
      setFilteredProducts(filtered);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [activeFilters, sortField, sortDirection]);

  // Handle filter changes
  const handleFiltersChange = (filters: Record<string, any>) => {
    setActiveFilters(filters);
  };

  // Handle sort changes
  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate current page's products
  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const currentProducts = getCurrentPageProducts();
  
  // Calculate applied filters summary
  const getAppliedFiltersText = () => {
    const parts = [];
    
    if (activeFilters.brand?.length) {
      parts.push(`Brand: ${activeFilters.brand.join(', ')}`);
    }
    
    if (activeFilters.price?.min || activeFilters.price?.max) {
      const priceText = `Price: ${activeFilters.price.min || '0'}-${activeFilters.price.max || '∞'}`;
      parts.push(priceText);
    }
    
    if (activeFilters.inStock) {
      parts.push('In Stock Only');
    }
    
    return parts.length ? parts.join(' | ') : '';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-2">All Products</h1>
        <p className="text-gray-600 text-center">
          Discover our collection of premium audio equipment
        </p>
      </div>

      {/* Mobile filter/sort controls */}
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-lg">
          <FunnelIcon className="h-5 w-5" />
          <span>Filter</span>
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-lg">
          <ArrowsUpDownIcon className="h-5 w-5" />
          <span>Sort</span>
        </button>
      </div>

      {/* Applied filters summary */}
      {getAppliedFiltersText() && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <span className="font-medium mr-2">Applied Filters:</span>
            <span className="text-sm text-gray-700">{getAppliedFiltersText()}</span>
            <button 
              onClick={() => setActiveFilters({})} 
              className="ml-auto text-blue-600 text-sm hover:text-blue-800"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar - desktop only */}
        <div className="hidden lg:block">
          <ProductsPageControls 
            onFiltersChange={handleFiltersChange}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Main content */}
        <div>
          {/* Results count and sort summary */}
          <div className="bg-slate-200 rounded-lg p-4 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-gray-700">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 && 's'}
                {sortField && (
                  <span className="text-gray-600">
                    {' '}sorted by {sortField} ({sortDirection})
                  </span>
                )}
              </p>
              
              {/* Desktop sort dropdown (simplified example) */}
              <div className="hidden lg:block relative">
                <select 
                  className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700"
                  value={`${sortField}-${sortDirection}`}
                  onChange={(e) => {
                    const [field, dir] = e.target.value.split('-');
                    handleSortChange(field, dir as 'asc' | 'desc');
                  }}
                >
                  <option value="-asc">Select sorting...</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="bg-slate-200 rounded-lg p-4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: productsPerPage }).map((_, index) => (
                  <ProductSkeletonCard key={`skeleton-${index}`} />
                ))}
              </div>
            ) : (
              <>
                {currentProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentProducts.map((product) => (
                      <div key={product._id}>
                        {/* Using the existing ProductThumb component with a mock image function */}
                        <ProductThumb 
                          product={{
                            ...product,
                            imageUrl: mockImageUrl
                          } as any} 
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-gray-700 text-lg mb-4">No products match your criteria</p>
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      onClick={() => setActiveFilters({})}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {!isLoading && filteredProducts.length > 0 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}