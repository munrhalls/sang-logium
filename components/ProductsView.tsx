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

interface ProductViewProps {
  products: ALL_PRODUCTS_QUERYResult;
}

export const ProductsView = ({ products }: ProductViewProps) => {
  const [visibleProducts, setVisibleProducts] = useState(products.slice(0, 20));
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      setVisibleProducts((prev) => {
        const nextBatch = products.slice(prev.length, prev.length + 20);
        return nextBatch.length > 0 ? [...prev, ...nextBatch] : prev;
      });
    }
  }, [inView, products]);

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
};

export default ProductsView;
