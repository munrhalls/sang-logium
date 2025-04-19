"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { client } from "@/lib/sanity.client";
import Pagination from "./PaginationComponent";

interface Product {
  _id: string;
  name: string;
  price: number;
  // other product fields
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Read search params only when they exist, otherwise use defaults
  const searchParams = useSearchParams();
  const currentPage = searchParams.has("page") 
    ? Math.max(1, Number(searchParams.get("page"))) 
    : 1;
  const pageSize = searchParams.has("pageSize") 
    ? Math.max(1, Number(searchParams.get("pageSize"))) 
    : 10;

  // Fetch data based on URL parameters or defaults when URL params not present
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      
      try {
        // Calculate pagination parameters for GROQ
        const start = (currentPage - 1) * pageSize;
        
        // GROQ query with pagination
        // We fetch one extra item to determine if there are more items
        // We also perform count() in the same query to avoid extra requests
        const query = `{
          "items": *[_type == "product"] | order(name asc) [${start}...${start + pageSize}] {
            _id,
            name,
            price,
            // other fields you need
          },
          "total": count(*[_type == "product"])
        }`;
        
        // Execute GROQ query with proper dependency tracking
        const result = await client.fetch(query);
        
        setProducts(result.items);
        setTotalCount(result.total);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    // Explicit dependency array with only pagination parameters
    // Only re-fetch when pagination params change
  }, [currentPage, pageSize]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Product list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div 
                key={product._id}
                className="border rounded-lg p-4 shadow-sm"
              >
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-gray-700">${product.price.toFixed(2)}</p>
                {/* Additional product details */}
              </div>
            ))}
          </div>
          
          {/* No results message */}
          {products.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              No products found.
            </div>
          )}
          
          {/* Pagination component */}
          <Pagination 
            totalItems={totalCount} 
            defaultPageSize={10}
          />
        </>
      )}
    </div>
  );
}