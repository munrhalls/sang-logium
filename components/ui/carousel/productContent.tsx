import React from "react";
import Image from "next/image";
import PriceLineCross from "../../../public/icons/PriceLineCross.svg";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

export default function ProductContent({
  product,
}: {
  product: NonNullable<
    GET_COMMERCIALS_BY_FEATURE_QUERYResult[0]["products"]
  >[0];
}) {
  const discountPrice =
    product.price - product.price * (product.discount / 100);

  return (
    <div className="z-50 max-w-[175px] flex flex-col justify-start items-start">
      <p className="text-xs font-extralight text-white mb-2">{product.name}</p>

      {/* Prices container */}
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
    </div>
  );
}
