"use client";

import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
import ProductsGrid from "./ProductsGrid";
import { useInView } from "react-intersection-observer";
import { useState, useEffect, Suspense } from "react";

const ProductsSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[...Array(12)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-gray-200 aspect-square rounded" />
        <div className="h-4 bg-gray-200 rounded mt-2 w-3/4" />
        <div className="h-4 bg-gray-200 rounded mt-2 w-1/2" />
      </div>
    ))}
  </div>
);

interface ClientProductViewProps {
  initialProducts: ALL_PRODUCTS_QUERYResult;
  allProducts: ALL_PRODUCTS_QUERYResult;
}

export default function ClientProductsView({
  initialProducts,
  allProducts,
}: ClientProductViewProps) {
  const [visibleProducts, setVisibleProducts] = useState(initialProducts);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      setVisibleProducts((prev) => {
        const nextBatch = allProducts.slice(prev.length, prev.length + 20);
        return nextBatch.length > 0 ? [...prev, ...nextBatch] : prev;
      });
    }
  }, [inView, allProducts]);

  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <div className="flex flex-col">
        <div>
          <div className="flex-1">
            <ProductsGrid products={visibleProducts} />
            <div ref={ref} className="h-full" />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
