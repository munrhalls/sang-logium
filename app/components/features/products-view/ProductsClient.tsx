"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProductThumb from "@/app/components/features/products-view/ProductThumb";

function clientSideFilter(products, params) {
  if (!products || !params) return products;

  return products.filter((product) => {
    const priceRange = params.get("priceRange");
    if (priceRange && product.price > parseInt(priceRange)) {
      return false;
    }

    const brandParam = params.get("brand");
    if (brandParam) {
      try {
        const brands = JSON.parse(brandParam);
        if (
          Array.isArray(brands) &&
          brands.length > 0 &&
          !brands.includes(product.brand)
        ) {
          return false;
        }
      } catch (e) {
        if (product.brand !== brandParam) {
          return false;
        }
      }
    }

    const inStock = params.get("inStock");
    if (inStock === "true" && (!product.stock || product.stock <= 0)) {
      return false;
    }

    return true;
  });
}

export default function ProductsClient({
  initialProducts,
  category,
  urlParams,
}) {
  const [products, setProducts] = useState(initialProducts);
  const [serverProducts, setServerProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const filteredProducts = clientSideFilter(serverProducts, searchParams);
    setProducts(filteredProducts);
  }, [searchParams, serverProducts]);

  const handleServerFilterUpdate = useCallback((newProducts) => {
    setServerProducts(newProducts);
  }, []);

  useEffect(() => {
    if (!searchParams.toString()) {
      setProducts(initialProducts);
      setServerProducts(initialProducts);
      return;
    }

    if (initialProducts && !loading && !searchParams.toString()) return;

    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        const newProducts = await fetch(
          `/api/products/${category}?${searchParams.toString()}`
        ).then((res) => res.json());
        setProducts(newProducts);
        setServerProducts(newProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredProducts();
  }, [searchParams, category, initialProducts, loading]);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute top-0 right-0 m-4">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 bg-slate-200">
        {products?.map((product) => (
          <div key={product._id}>
            <ProductThumb product={product} />
          </div>
        ))}
        {products?.length === 0 && (
          <div className="col-span-full text-center py-10">
            No products match your filter criteria
          </div>
        )}
      </div>
    </div>
  );
}
