import { Category, Product } from "@/sanity.types";
import ProductsGrid from "./ProductsGrid";

interface ProductViewProps {
  products: Product[];
  categories: Category[];
}

export const ProductsView = ({ products, categories }: ProductViewProps) => {
  return (
    <div className="flex flex-col">
      {/* categories */}
      <div className="W-FULL SM:W-(200px">
        <CategorySelectorComponent categories={categories} />
      </div>

      {/* products */}
      <div>
        <div className="flex-1">
          <ProductsGrid products={products} />
        </div>
      </div>
    </div>
  );
};

export default ProductsView;
