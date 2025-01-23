import { ProductProps, ProductCard } from "./staticProductCard";

type ProductsProps = {
  products: ProductProps[];
  discount: number | null;
};

function ProductsCommercial({ products, discount }: ProductsProps) {
  return (
    <div
      className={`/* products container */ z-40 h-full grid md:grid-flow-col auto-cols-fr gap-2`}
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} discount={discount} />
      ))}
    </div>
  );
}

export default ProductsCommercial;
