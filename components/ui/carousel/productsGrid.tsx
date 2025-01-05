import ProductCard from "./productCard";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

const ProductsGrid = ({
  products,
}: {
  products: GET_COMMERCIALS_BY_FEATURE_QUERYResult[0]["products"];
}) => {
  if (!products) return null;

  return (
    <div className="container-type-[inline-size] p-12">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))]">
        {products.map((product, index) => (
          <div
            key={product._id}
            className={`${index > 1 ? "hidden 2xs:block" : ""}`}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductsGrid;
