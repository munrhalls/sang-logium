import { ProductProps, ProductCard } from "./staticProductCard";

type ProductsProps = {
  products: ProductProps[];
  discount: number | null;
};

function ProductsCommercial({ products, discount }: ProductsProps) {
  return (
    <div className="z-30 h-full w-full  grid p-4 gap-3 lg:auto-cols-fr">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} discount={discount} />
      ))}
    </div>
  );
}

export default ProductsCommercial;
