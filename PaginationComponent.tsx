"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalItems: number;
  defaultPageSize?: number;
  // onPageChange is optional since we're using URL params as source of truth
  onPageChange?: (page: number, pageSize: number) => void;
}

/**
 * Pagination component that uses URL search parameters as the source of truth
 */
export default function Pagination({
  totalItems,
  defaultPageSize = 10,
  onPageChange,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Only store the calculated total pages
  const [totalPages, setTotalPages] = useState(1);

  // Read from search params only when they exist, otherwise use defaults
  const currentPage = searchParams.has("page") 
    ? Math.max(1, Number(searchParams.get("page"))) 
    : 1;
    
  const pageSize = searchParams.has("pageSize") 
    ? Math.max(1, Number(searchParams.get("pageSize"))) 
    : defaultPageSize;

  // Recalculate total pages when dependencies change
  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(totalItems / pageSize)));
  }, [totalItems, pageSize]);

  // Update URL when user changes page
  const handlePageChange = (newPage: number) => {
    // Validate the new page number
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    
    // Create new URLSearchParams object for immutability
    const params = new URLSearchParams(searchParams);
    
    // Update the page parameter
    params.set("page", validPage.toString());
    
    // Replace URL with new parameters
    router.push(`${pathname}?${params.toString()}`);
    
    // Call optional callback for compatibility
    if (onPageChange) {
      onPageChange(validPage, pageSize);
    }
  };

  // Update URL when user changes page size
  const handlePageSizeChange = (newPageSize: number) => {
    // Validate the page size
    const validPageSize = Math.max(1, newPageSize);
    
    // Create new URLSearchParams object for immutability
    const params = new URLSearchParams(searchParams);
    
    // Update pageSize and reset to page 1 to avoid out-of-range issues
    params.set("pageSize", validPageSize.toString());
    params.set("page", "1");
    
    // Replace URL with new parameters
    router.push(`${pathname}?${params.toString()}`);
    
    // Call optional callback for compatibility
    if (onPageChange) {
      onPageChange(1, validPageSize);
    }
  };

  // Generate pagination items with format: 1 2 3 ... num ... last
  const getPaginationItems = () => {
    const items = [];
    
    // Always show first page
    items.push(1);
    
    // For small page counts, just show all pages
    if (totalPages <= 7) {
      for (let i = 2; i < totalPages; i++) {
        items.push(i);
      }
      if (totalPages > 1) {
        items.push(totalPages);
      }
      return items;
    }
    
    // For larger page counts, show context around current page
    // Always show first 3 pages
    if (currentPage > 3) {
      items.push(2, 3);
      // Add ellipsis if current page is not right after
      if (currentPage > 4) {
        items.push("...");
      }
    } else {
      // We're on pages 1-3, so just show first few pages
      items.push(2, 3, 4);
    }
    
    // Pages around current page
    if (currentPage > 3 && currentPage < totalPages - 2) {
      // Show the current page and one on each side if possible
      if (currentPage - 1 > 3) {
        items.push(currentPage - 1);
      }
      if (currentPage !== 1 && currentPage !== totalPages) {
        items.push(currentPage);
      }
      if (currentPage + 1 < totalPages - 2) {
        items.push(currentPage + 1);
      }
    }
    
    // Handle final part of pagination
    if (currentPage < totalPages - 2) {
      // Add ellipsis if needed
      if (currentPage < totalPages - 3) {
        items.push("...");
      }
      // Always show last two pages
      items.push(totalPages - 1, totalPages);
    } else {
      // We're near the end, so show last few pages without ellipsis
      if (totalPages - 3 > 3 && !items.includes(totalPages - 3)) {
        items.push(totalPages - 3);
      }
      if (totalPages - 2 > 3 && !items.includes(totalPages - 2)) {
        items.push(totalPages - 2);
      }
      if (totalPages - 1 > 1 && !items.includes(totalPages - 1)) {
        items.push(totalPages - 1);
      }
      if (!items.includes(totalPages)) {
        items.push(totalPages);
      }
    }
    
    // Remove duplicates and ensure order
    return [...new Set(items)].sort((a, b) => {
      // Handle ellipsis in sorting
      if (a === "...") return typeof b === "number" && b > 3 ? -1 : 1;
      if (b === "...") return typeof a === "number" && a > 3 ? 1 : -1;
      return Number(a) - Number(b);
    });
  };

  // Don't render pagination for empty or single-page results
  if (totalItems <= 0 || totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col items-center mt-8 space-y-4">
      <div className="flex items-center space-x-1">
        {/* Previous page button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`p-2 rounded-md ${
            currentPage <= 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Page numbers */}
        {getPaginationItems().map((item, index) => {
          if (item === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-4 py-2 text-gray-400"
              >
                ...
              </span>
            );
          }
          
          const page = Number(item);
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-md ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next page button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`p-2 rounded-md ${
            currentPage >= totalPages
              ? "opacity-50 cursor-not-allowed" 
              : "hover:bg-gray-100"
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Page size selector */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">Items per page:</span>
        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          className="border rounded-md px-2 py-1 text-sm"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}