import ProductCard from "./productCard";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

const ProductsGrid = ({
  products,
}: {
  products: NonNullable<GET_COMMERCIALS_BY_FEATURE_QUERYResult[0]["products"]>;
}) => {
  if (!products) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-8">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
export default ProductsGrid;
