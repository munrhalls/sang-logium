"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductThumb from "@/app/components/features/products-view/ProductThumb";

export default function ProductsClient({
  initialProducts,
  category,
  urlParams,
}) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (initialProducts && !loading) return;

    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        const newProducts = await fetch(
          `/api/products/${category}?${searchParams.toString()}`
        ).then((res) => res.json());
        setProducts(newProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredProducts();
  }, [searchParams, category, initialProducts]);

  if (loading) {
    return <div className="loading-skeleton">Loading products...</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 bg-slate-200">
      {products?.map((product) => {
        return (
          <div key={product._id}>
            <ProductThumb product={product} />
          </div>
        );
      })}
    </div>
  );
}
