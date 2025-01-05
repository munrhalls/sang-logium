import React from "react";
import Image from "next/image";
import PriceLineCross from "../../../public/icons/PriceLineCross.svg";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

const ProductContent = ({
  product,
}: {
  product: NonNullable<
    GET_COMMERCIALS_BY_FEATURE_QUERYResult[0]["products"]
  >[0];
}) => {
  const discountPrice = product.price * (1 - product.discount / 100);

  return (
    <div className="flex-1 flex flex-col justify-start items-start flex-wrap gap-2 text-white text-xs 2xs:text-sm font-black font-oswald sm:block sm:max-h-28 sm:relative sm:mt-2">
      <p className="xl:text-lg">{product.name}</p>

      <div className="relative md:absolute md:bottom-0 md:mt-4 lg:mt-8 xl:mt-12">
        <span className="text-gray-300 font-black lg:text-xl xl:text-xl">
          {product.price.toFixed(2)}$
          <Image
            src={PriceLineCross}
            width={40}
            height={4}
            alt=""
            className="absolute inset-x-0 top-1/2 -translate-y-1/2"
          />
        </span>
        <span className="mt-2 absolute left-12 font-black text-lightpromotion text-lg sm:text-xl sm:mt-4 md:text-2xl lg:text-2xl xl:text-2xl">
          {discountPrice.toFixed(2)}$
        </span>
      </div>
    </div>
  );
};
export default ProductContent;
