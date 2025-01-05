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
    <div className="">
      <p className="">{product.name}</p>

      {/* Prices container */}
      <div className="">
        <span>
          {product.price.toFixed(2)}$
          <Image
            className="z-50 absolute top-[-2px] left-0 right-0 h-[125%]"
            src={PriceLineCross}
            alt={"crossed"}
          />
        </span>
        <span>{discountPrice.toFixed(2)}$</span>
      </div>
    </div>
  );
}
