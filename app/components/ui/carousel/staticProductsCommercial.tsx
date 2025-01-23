import { ProductProps, ProductCard } from "./staticProductCard";

type ProductsProps = {
  products: ProductProps[];
  discount: number | null;
};

function ProductsCommercial({ products, discount }: ProductsProps) {
  return (
    <div className="h-full w-full grid gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} discount={discount} />
      ))}
    </div>
  );
}

export default ProductsCommercial;
