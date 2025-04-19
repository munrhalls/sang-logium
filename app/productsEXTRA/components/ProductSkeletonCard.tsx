"use client";

/**
 * Loading skeleton for product cards
 */
export default function ProductSkeletonCard() {
  return (
    <div className="flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-pulse">
      <div className="p-4">
        {/* Image placeholder */}
        <div className="bg-gray-200 aspect-square rounded-sm" />
        
        {/* Title placeholder */}
        <div className="h-6 bg-gray-200 rounded mt-3 w-3/4" />
        
        {/* Description placeholder */}
        <div className="mt-2 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        
        {/* Price placeholder */}
        <div className="mt-2 flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-8 w-8 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}