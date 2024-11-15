import { Product } from "@/sanity.types";

interface ProductViewProps {
  products: Product[];
}

export const ProductsView = ({ products }: ProductViewProps) => {
  return <div>
    {/* categories */}
    <div className=""></div>

    {/* products */}
    <div>
        <div class="flex-1">
            <ProductsGrid products={products} />>
        </div>
    </div>
  </div>;
};

export default ProductsView;
