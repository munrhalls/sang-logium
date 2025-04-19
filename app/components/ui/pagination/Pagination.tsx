"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import { useEffect, useCallback } from "react";

const PaginationArrows = function ({ onPrev, onNext, canGoPrev, canGoNext }) {
  return (
    <div className="flex gap-3 items-center justify-center">
      <button
        onClick={onPrev}
        disabled={!canGoPrev}
        className={`text-xs flex items-center justify-center font-light uppercase ${
          !canGoPrev ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <FaChevronLeft size={10} className="mr-1" /> PREVIOUS
      </button>
      <FaBookOpen />
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`text-xs flex items-center justify-center font-light uppercase ${
          !canGoNext ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        NEXT <FaChevronRight size={10} className="ml-1" />
      </button>
    </div>
  );
};

export default function Pagination({
  totalItems,
  defaultPageSize = 10,
}: {
  totalItems: number;
  defaultPageSize?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get pagination values from URL or use defaults
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || defaultPageSize;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Update URL with new pagination parameters
  const updateUrl = useCallback(
    (page: number, size: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      params.set("pageSize", size.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Initialize URL with defaults if needed
  useEffect(() => {
    if (!searchParams.has("page") || !searchParams.has("pageSize")) {
      updateUrl(currentPage, pageSize);
    }
  }, [currentPage, pageSize, searchParams, updateUrl]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateUrl(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    // When changing page size, reset to page 1
    updateUrl(1, newPageSize);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    handlePageChange(1);
  };

  const handleLastPage = () => {
    handlePageChange(totalPages);
  };

  const pageSizeOptions = [10, 20, 50, 100];

  return (
    <div className="px-4 py-3 flex flex-col bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <h1 className="font-black">Page</h1>
          <PaginationArrows
            onPrev={handlePrevPage}
            onNext={handleNextPage}
            canGoPrev={currentPage > 1}
            canGoNext={currentPage < totalPages}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Items per page:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="border rounded p-1 text-sm"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <span className="text-sm ml-4">
            {currentPage} of {totalPages} pages
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="flex flex-nowrap gap-3">
          {totalPages > 0 && (
            <button
              onClick={handleFirstPage}
              className={`flex items-center justify-center ${
                currentPage === 1
                  ? "text-blue-500 font-medium"
                  : "text-black hover:bg-gray-100"
              }`}
            >
              1
            </button>
          )}

          {currentPage > 3 && <span className="px-2">...</span>}

          {currentPage > 2 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="text-black hover:bg-gray-100"
            >
              {currentPage - 1}
            </button>
          )}

          {currentPage > 1 && currentPage < totalPages && (
            <button className="text-blue-500 font-medium">{currentPage}</button>
          )}

          {currentPage < totalPages - 1 && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="text-black hover:bg-gray-100"
            >
              {currentPage + 1}
            </button>
          )}

          {currentPage < totalPages - 2 && <span className="px-2">...</span>}

          {totalPages > 1 && (
            <button
              onClick={handleLastPage}
              className={`flex items-center justify-center ${
                currentPage === totalPages
                  ? "text-blue-500 font-medium"
                  : "text-black hover:bg-gray-100"
              }`}
            >
              {totalPages}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
