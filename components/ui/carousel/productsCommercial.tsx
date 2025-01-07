// products.tsx
import Image from "next/image";
import Link from "next/link";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

type Product = NonNullable<
  GET_COMMERCIALS_BY_FEATURE_QUERYResult[0]["products"]
>[0];

const ProductCard = ({ product }: { product: Product }) => {
  if (!product) return null;
  const discountPrice = product.price * (1 - product.discount / 100);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="grid grid-cols-[1fr_3fr] gap-6 bg-black/40 rounded-lg h-full sm:grid-cols-1 sm:row-start-2 sm:grid-rows-2"
    >
      <div className="relative w-full h-full rounded-lg">
        <div className="absolute inset-0 ">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain aspect-square bg-black"
          />
        </div>
      </div>

      <div className="grid text-xs 2xs:text-lg xl:text-2xl px-2 md:px-4 lg:px-6">
        <span className="block text-white truncate sm:text-wrap">
          {product.name}
        </span>
        <div className="flex sm:justify-center">
          <span className="inline-block  text-gray-300 line-through">
            ${product.price.toFixed(2)}
          </span>
          <span className="inline-block mt-1 text-lightpromotion font-bold">
            ${discountPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export const ProductsCommercial = ({ products }: { products: Product[] }) => {
  if (!products?.length) return null;

  return (
    <div
      className="z-30 relative h-full w-full grid grid-rows-3 place-content-center gap-2 pb-8 pt-4 px-12
    sm:px-20 sm:grid-rows-[1fr_4fr_1fr] sm:grid-cols-3 sm:gap-6 lg:max-w-[80%] lg:mx-auto lg:gap-16 xl:gap-24 "
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductsCommercial;
