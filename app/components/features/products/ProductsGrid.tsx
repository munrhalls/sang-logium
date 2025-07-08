import ProductThumb from "@/app/components/features/products/ProductThumb";
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
export default function ProductsGrid({
  products,
}: {
  products: ALL_PRODUCTS_QUERYResult;
}) {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 bg-slate-200">
        {products?.map((product) => {
          return (
            <div key={product._id}>
              <ProductThumb product={product} />
            </div>
          );
        })}
        {products?.length === 0 && (
          <div className="col-span-full text-center py-10">
            No products match your filter criteria
          </div>
        )}
      </div>
    </div>
  );
}
