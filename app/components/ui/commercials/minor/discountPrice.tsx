import Image from "next/image";
import PriceLineCross from "@/public/icons/PriceLineCross.svg";
const DiscountPrice = function ({
  price,
  discount,
  priceColor,
}: {
  price: number;
  discount: number;
  priceColor: string;
}) {
  const discountPrice = price - (discount / 100) * price;
  return (
    <div className="mx-2 grid grid-rows-[0.1rem_1fr]">
      <span className="text-gray-400 text-xs md:text-md lg:text-lg lg:pb-2  relative flex justify-center items-center">
        ${price.toFixed(2)}
        <div className="z-40 absolute inset-0 h-full w-full flex justify-center items-center lg:pb-2">
          <Image
            loading="lazy"
            src={PriceLineCross}
            alt="Price line cross"
            width={54}
            unoptimized
          />
        </div>
      </span>
      <span
        className="ml-2 pt-2 font-bold text-xs md:text-xl lg:font-black  lg:text-2xl xl:text-3xl block"
        style={{ color: priceColor }}
      >
        ${discountPrice?.toFixed(2)}
      </span>
    </div>
  );
};
export default DiscountPrice;
