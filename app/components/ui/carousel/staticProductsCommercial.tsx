import { ProductProps, ProductCard } from "./staticProductCard";

type ProductsProps = {
  products: ProductProps[];
  discount: number | null;
};

function ProductsCommercial({ products, discount }: ProductsProps) {
  return (
    <div
      className={`z-40 h-full w-full grid md:grid-flow-col auto-cols-fr gap-2 lg:gap-4`}
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} discount={discount} />
      ))}
    </div>
  );
}

export default ProductsCommercial;
