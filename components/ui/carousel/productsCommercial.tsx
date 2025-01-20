import { ProductProps, ProductCard } from "./productCard";

type ProductsProps = {
  products: ProductProps[];
  discount: number | null;
};

function ProductsCommercial({ products, discount }: ProductsProps) {
  return (
    <div className="z-40 relative h-full w-full gap-4 md:gap-6 lg:gap-16 xl:gap-20 grid align-content-start justify-content-center md:grid-rows-1 md:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} discount={discount} />
      ))}
    </div>
  );
}

export default ProductsCommercial;
