import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";
// import PriceLineCross from "@/public/icons/PriceLineCross.svg";

const Price = ({
  price,
  priceColor,
}: {
  price: number;
  priceColor: string;
}) => {
  return (
    <div>
      <span className="telinext-white font-bold sm:font-black text-xs sm:text-lg md:text-xl">
        ONLY
      </span>
      <span
        className="ml-1 font-bold sm:font-black text-md sm:text-lg md:text-xl"
        style={{ color: priceColor }}
      >
        ${price.toFixed(2)}
      </span>
    </div>
  );
};

const DiscountPrice = ({
  price,
  discount,
  priceColor,
}: {
  price: number;
  discount: number;
  priceColor: string;
}) => {
  const discountPrice = price - (discount / 100) * price;

  return (
    <>
      <span className="text-gray-400 relative block">
        $
        <div className="z-40 absolute inset-0 h-full w-full">
          {/* <PriceLineCross /> */}
        </div>
        {price.toFixed(2)}
      </span>
      <span
        className="ml-1 pt-2 font-bold sm:font-black text-md sm:text-lg md:text-xl"
        style={{ color: priceColor }}
      >
        ${discountPrice?.toFixed(2)}
      </span>
    </>
  );
};

export type ProductProps = {
  _id: string;
  brand: string;
  price: number;
  image: string;
};

type Props = {
  product: ProductProps;
  discount: number | null;
  priceColor: string;
};

export const ProductCard = ({ product, discount, priceColor }: Props) => {
  return (
    <div className="z-20 h-full bg-pink-600 border border-black"></div>
    // <div className="/* PRODUCT CARD */ z-30 h-full min-h-0 grid gap-2 bg-white text-black rounded-sm font-oswald">
    //   <Link
    //     href={`/product/${product._id}`}
    //     className=" text-black relative aspect-square w-[clamp(4px,50%,50px)] md:w-[clamp(16px,50%,140px)] place-self-center"
    //   >
    //     <span className="z-40 max-w-full text-black truncate font-bold text-xs md:text-lg md:mb-4 xl:text-2xl">
    //       {product.brand}
    //     </span>

    //     <Image
    //       loading="lazy"
    //       decoding="async"
    //       quality={100}
    //       sizes="(max-width: 768px) 36vw, 25vw"
    //       src={imageUrl(product.image).url()}
    //       alt={product.brand}
    //       height={40}
    //       width={40}
    //       className="z-40 h-full w-full absolute inset-0 aspect-square object-cover rounded-sm"
    //     />

    //     <div className="z-40 min-w-0 max-w-full flex flex-col justify-center items-start">
    //       <div className="z-40 flex">
    //         {discount ? (
    //           <DiscountPrice
    //             price={product.price}
    //             discount={discount}
    //             priceColor={priceColor}
    //           />
    //         ) : (
    //           <Price price={product.price} priceColor={priceColor} />
    //         )}
    //       </div>
    //     </div>
    //   </Link>
    // </div>
  );
};
