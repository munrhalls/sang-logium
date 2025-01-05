import Image from "next/image";
import Link from "next/link";
import PriceLineCross from "../../../public/icons/PriceLineCross.svg";

import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

const ProductCard = ({
  product,
}: {
  product: NonNullable<
    GET_COMMERCIALS_BY_FEATURE_QUERYResult[0]["products"]
  >[0];
}) => {
  if (!product) return null;

  const discountPrice =
    product.price - product.price * (product.discount / 100);

  return (
    <Link href={`/product/${product.slug}`} className="group w-full">
      <div className="bg-black/20 rounded-lg p-2 sm:p-4">
        <div className="flex flex-row-reverse sm:flex-col gap-4">
          {/* Image container */}
          <div className="w-12 h-12 sm:w-full aspect-square relative">
            <Image
              src={product.image}
              alt={product.name || "Product image"}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Content container */}
          <div className="z-50 max-w-[125px] flex flex-col justify-center items-start">
            <p className="text-xs text-white mb-2 truncate w-full">
              {product.name}
            </p>

            {/* Prices container */}
            <div className="flex justify-center items-center gap-4 sm:flex-row sm:justify-between text-white mt-auto">
              <span className="relative text-sm">
                {product.price.toFixed(2)}$
                <Image
                  className="z-50 absolute inset-0 w-[80%]"
                  src={PriceLineCross}
                  alt={"crossed"}
                />
              </span>
              <span className="text-md">{discountPrice.toFixed(2)}$</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default ProductCard;
