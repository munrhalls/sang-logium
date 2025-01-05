import { Commercial } from "@/sanity.types";
import ProductCard from "./productCard";

interface ProductsGridProps {
  products: Commercial["products"];
}

const ProductsGrid = ({ products }: ProductsGridProps) => {
  if (!products) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-8">
      {products.map((product) => (
        <ProductCard
          key={product._key}
          product={product}
          // accentColor={accentColor}
        />
      ))}
    </div>
  );
};
export default ProductsGrid;
