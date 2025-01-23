import { ProductProps, ProductCard } from "./staticProductCard";

type ProductsProps = {
  products: ProductProps[];
  discount: number | null;
};

function ProductsCommercial({ products, discount }: ProductsProps) {
  return (
    <div></div>
    // <div className={`/* products container */ z-40 h-full grid gap-3`}>
    //   <div className="bg-blue-700 h-full grid grid-cols-[33%_2fr]">
    //     <div className="bg-black h-full w-full "></div>
    //     <div className="bg-pink-700 h-full w-full "></div>
    //   </div>
    //   <div className="bg-blue-700 grid grid-cols-[33%_2fr]">
    //     <div className="bg-black h-full w-full "></div>
    //     <div className="bg-pink-700 h-full w-full "></div>
    //   </div>
    //   <div className="bg-blue-700 grid grid-cols-[33%_2fr]">
    //     <div className="bg-black h-full w-full "></div>
    //     <div className="bg-pink-700 h-full w-full "></div>
    //   </div>
    //   {products.map((product) => (
    //     <ProductCard key={product._id} product={product} discount={discount} />
    //   ))}
    // </div>
  );
}

export default ProductsCommercial;
