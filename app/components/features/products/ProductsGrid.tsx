import ProductThumb from "@/app/components/features/products/ProductThumb";
import { ALL_PRODUCTS_QUERYResult } from "@/sanity.types";
export default function ProductsGrid({
  products,
}: {
  products: ALL_PRODUCTS_QUERYResult;
}) {
  return (
    <div className="relative">
      <div className="mt-4 grid grid-cols-1 gap-4 bg-slate-200 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products?.map((product) => {
          return (
            <div key={product._id}>
              <ProductThumb product={product} />
            </div>
          );
        })}
        {products?.length === 0 && (
          <div className="col-span-full py-10 text-center">
            No products match your filter criteria
          </div>
        )}
      </div>
    </div>
  );
}
