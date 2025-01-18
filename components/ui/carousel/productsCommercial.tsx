// products.tsx
import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";
type Product = NonNullable<
  GET_COMMERCIALS_BY_FEATURE_QUERYResult[0]["products"]
>[0];
import { memo, useMemo } from "react";

type CardProps = {
  product: Product;
  discount: number | null;
};

const ProductCard = ({ product, discount }: CardProps) => {
  const discountPrice = useMemo(
    () => (discount ? product.price || 0 * (1 - discount / 100) : null),
    [product.price, discount]
  );

  if (!product || !product?.price || !product?.image || !product?.name) {
    console.error("Product is missing required fields");
    return null;
  }

  const priceDisplay = () => {
    if (!product?.price) {
      return null;
    }

    if (!discount) {
      return (
        <span className="text-lightpromotion text-xs 2xs:text-lg md:text-xl lg:text-2xl mt-1">
          ${product.price.toFixed(2)}
        </span>
      );
    }

    return (
      <>
        <span className="text-gray-400">${product.price.toFixed(2)}</span>
        <span className="text-lightpromotion text-xs 2xs:text-lg md:text-xl lg:text-2xl mt-1">
          ${discountPrice?.toFixed(2)}
        </span>
      </>
    );
  };

  return (
    <Link
      href={`/product/${product._id}`}
      // className="p-1 pl-2 md:pt-4 bg-black/40 rounded-lg place-items-center md:items-center gap-4 grid grid-cols-[3rem_2fr_1.5rem] 2xs:grid-cols-[1fr_3fr_1.5rem] md:grid-cols-1 md:grid-rows-[1fr_1fr_1.5rem] "
      className="bg-black/40 pl-2 md:pt-4 rounded-lg sm:place-items-center md:items-center gap-4 grid grid-cols-[3rem_2fr_1.5rem] 2xs:grid-cols-[1fr_3fr_1.5rem] md:grid-cols-1 md:grid-rows-[1fr_1fr_1.5rem] "
    >
      <div className="relative h-full w-full rounded-xl">
        <Image
          loading="lazy"
          decoding="async"
          quality={50}
          sizes="(max-width: 768px) 33vw, 25vw"
          src={imageUrl(product.image).url()}
          alt={product.name}
          height={80}
          width={80}
          className="w-full absolute inset-0 object-contain aspect-square rounded-xl"
        />
      </div>

      <div className="grid md:gap-2 lg:px-8 md:h-full w-full font-oswald text-white md:text-center text-xs font-light 2xs:text-lg md:text-sm md:font-black lg:text-lg justify-start">
        <span className="truncate md:text-wrap flex items-center">
          {product.name}
        </span>

        <div className="flex font-black lg:justify-center lg:items-center">
          {priceDisplay()}
        </div>
      </div>
    </Link>
  );
};

type ProductsProps = {
  products: Product[];
  discount: number | null;
};

const ProductsCommercial = memo(function ProductsCommercial({
  products,
  discount,
}: ProductsProps) {
  if (!products?.length) return null;

  return (
    <div className="z-40 relative h-full w-full gap-4 md:gap-6 lg:gap-16 xl:gap-20 grid align-content-start justify-content-center md:grid-rows-1 md:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} discount={discount} />
      ))}
    </div>
  );
});

export default ProductsCommercial;
