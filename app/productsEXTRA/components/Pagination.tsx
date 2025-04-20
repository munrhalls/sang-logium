"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Pagination component for products listing
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 1;

    let initialNums = [];
    let throughNums = [];
    let lastNum = null;

    if (currentPage > 1 + delta) {
      initialNums = [1];

      if (currentPage - delta > 2) {
        throughNums = Array.from(
          { length: 2 * delta + 1 },
          (_, i) => currentPage - delta + i
        );
      } else {
        initialNums = Array.from(
          { length: currentPage + delta },
          (_, i) => i + 1
        );
      }
    } else {
      initialNums = Array.from(
        { length: Math.min(1 + 2 * delta, totalPages) },
        (_, i) => i + 1
      );
    }

    if (currentPage + delta < totalPages - 1) {
      lastNum = totalPages;
    } else if (initialNums[initialNums.length - 1] !== totalPages) {
      throughNums = Array.from(
        { length: Math.min(totalPages - (currentPage - delta), totalPages) },
        (_, i) => i + (currentPage - delta)
      ).filter((n) => n > initialNums[initialNums.length - 1]);
    }

    return { initialNums, throughNums, lastNum };
  };

  // Don't show pagination if only one page
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-1 mt-8">
      {/* Previous button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`p-2 rounded-md ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-600 hover:bg-blue-100"
        }`}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        if (page === "ellipsis1" || page === "ellipsis2") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="w-10 h-10 flex items-center justify-center text-gray-500"
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`w-10 h-10 rounded-md ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-100"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-600 hover:bg-blue-100"
        }`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
