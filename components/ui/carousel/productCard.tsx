import Image from "next/image";
import Link from "next/link";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";
import ProductContent from "./productContent";

const ProductCard = ({
  product,
}: {
  product: NonNullable<
    GET_COMMERCIALS_BY_FEATURE_QUERYResult[0]["products"]
  >[0];
}) => {
  if (!product) return null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="bg-black/40 z-50 group w-full font-oswald"
    >
      <div className=" rounded-lg sm:p-4">
        <div className="flex gap-4 mb-8">
          {/* Image container */}
          <div className="w-16 h-16 sm:w-full aspect-square relative">
            <Image
              src={product.image}
              alt={product.name || "Product image"}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Content container */}
          <ProductContent product={product} />
          {/* <div className="z-50 max-w-[175px] flex flex-col justify-start items-start">
            <p className="text-xs font-extralight text-white mb-2">
              {product.name}
            </p>

            <div className="mt-2 relative left-0 right-0 text-white text-center">
              <span className="absolute left-0 top-[-6px] text-sm text-gray-200 font-normal">
                {product.price.toFixed(2)}$
                <Image
                  className="z-50 absolute top-[-2px] left-0 right-0 h-[125%]"
                  src={PriceLineCross}
                  alt={"crossed"}
                />
              </span>
              <span className="absolute left-8 text-xl text-lightpromotion font-black">
                {discountPrice.toFixed(2)}$
              </span>
            </div>
          </div> */}
        </div>
      </div>
    </Link>
  );
};
export default ProductCard;
