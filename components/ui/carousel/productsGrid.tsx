import ProductCard from "./productCard";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

const ProductsGrid = ({
  products,
}: {
  products: GET_COMMERCIALS_BY_FEATURE_QUERYResult[0]["products"];
}) => {
  if (!products) return null;

  return (
    <div className="absolute max-w-sm mx-auto px-10 left-0 right-0 top-0 bottom-0 sm:max-w-2xl sm:flex sm:flex-col sm:justify-center sm:items-center lg:max-w-4xl lg:px-0">
      <div className="absolute inset-0 flex flex-col justify-center items-start gap-8 py-6 mx-10 2xs:items-center sm:flex-row sm:justify-around sm:items-center sm:py-0 lg:gap-8">
        {products.map((product, index) => (
          <div
            key={product._id}
            className={`${index > 1 ? "hidden" : ""} sm:block  sm:h-2/3  w-full`}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductsGrid;
