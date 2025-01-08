// products.tsx
import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";
import { ArrowRight } from "lucide-react";
type Product = NonNullable<
  GET_COMMERCIALS_BY_FEATURE_QUERYResult[0]["products"]
>[0];

const ProductCard = ({ product }: { product: Product }) => {
  if (!product) return null;
  const discountPrice = product.price * (1 - product.discount / 100);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="p-1 pl-2 md:pt-4 bg-black/40 rounded-lg place-items-center md:items-center gap-4 grid grid-cols-[3rem_2fr_1.5rem] 2xs:grid-cols-[1fr_3fr_1.5rem] md:grid-cols-1 md:grid-rows-[1fr_1fr_1.5rem] "
    >
      <div className="relative h-full w-full rounded-xl">
        <Image
          loading="lazy"
          src={imageUrl(product.image).url()}
          alt={product.name}
          height={80}
          width={80}
          quality={90}
          className="absolute inset-0 object-contain aspect-square rounded-xl"
        />
      </div>

      <div className="grid md:gap-2 lg:px-8 md:h-full w-full font-oswald text-white md:text-center text-xs 2xs:text-lg md:text-sm md:font-black lg:text-lg justify-start">
        <span className="truncate md:text-wrap flex items-center">
          {product.name}
        </span>

        <div className="flex font-black lg:justify-center lg:items-center">
          <span className="text-gray-400">${product.price.toFixed(2)}</span>
          <span className="text-lightpromotion text-xs 2xs:text-lg md:text-xl lg:text-2xl mt-1">
            ${discountPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <ArrowRight className="text-promotion md:hidden"></ArrowRight>
      <div>
        <span className="text-lightpromotion hidden md:inline-block text-xl mb-4">
          SEE NOW
        </span>
      </div>
    </Link>
  );
};

export const ProductsCommercial = ({ products }: { products: Product[] }) => {
  if (!products?.length) return null;

  return (
    <div className="z-30 relative h-full w-full  gap-2 md:gap-6 lg:gap-16 xl:gap-20 grid grid-rows-3 md:grid-rows-1 md:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductsCommercial;
