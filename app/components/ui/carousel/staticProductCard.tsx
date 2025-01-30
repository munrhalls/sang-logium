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
    <div className="h-full grid">
      <span className="text-xs font-extralight text-slate-700 sm:font-black sm:text-lg md:text-xl">
        only
      </span>
      <span
        className="ml-1 font-bold sm:font-black text-xs sm:text-lg md:text-xl"
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
    <div className="mx-2 grid grid-rows-[0.1rem_1fr]">
      <span className="text-gray-400 text-xs block">
        ${price.toFixed(2)}
        {/* <div className="z-40 absolute inset-0 h-full w-full "> */}
        {/* <PriceLineCross /> */}
        {/* </div> */}
      </span>
      <span
        className="ml-2 pt-2 font-bold text-xs md:text-xl block"
        style={{ color: priceColor }}
      >
        ${discountPrice?.toFixed(2)}
      </span>
    </div>
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
    <div className="z-30 h-full w-full  max-h-[225px] max-w-[250px] lg:max-h-[350px] lg:max-w-[350px] xl:max-h-[400px] xl:max-w-[400px] bg-white rounded-sm grid grid-rows-[1fr_2fr_1fr]">
      <span className="z-40 font-black w-full text-black text-center text-xs sm:text-md lg:text-lg xl:text-xl grid">
        {product.brand}
      </span>
      <div className="h-full w-full relative mx-auto">
        <Image
          loading="lazy"
          decoding="async"
          quality={100}
          sizes="(max-width: 768px) 36vw, 25vw"
          src={imageUrl(product.image).url()}
          alt={product.brand}
          height={60}
          width={60}
          className="z-40 h-full w-full absolute inset-0 aspect-square object-contain rounded-sm"
        />
      </div>
      <div className="z-40 grid place-content-center">
        {discount ? (
          <DiscountPrice
            price={product.price}
            discount={discount}
            priceColor={priceColor}
          />
        ) : (
          <Price price={product.price} priceColor={priceColor} />
        )}
      </div>
    </div>
  );
};

{
  /* <Link
        href={`/product/${product._id}`}
        className=" text-black relative aspect-square w-[clamp(4px,50%,50px)] md:w-[clamp(16px,50%,140px)] place-self-center"
      >
        <span className="z-40 max-w-full text-black truncate font-bold text-xs md:text-lg md:mb-4 xl:text-2xl">
          {product.brand}
        </span>

        <Image
          loading="lazy"
          decoding="async"
          quality={100}
          sizes="(max-width: 768px) 36vw, 25vw"
          src={imageUrl(product.image).url()}
          alt={product.brand}
          height={40}
          width={40}
          className="z-40 h-full w-full absolute inset-0 aspect-square object-cover rounded-sm"
        />

        <div className="z-40 min-w-0 max-w-full flex flex-col justify-center items-start">
          <div className="z-40 flex">
            {discount ? (
              <DiscountPrice
                price={product.price}
                discount={discount}
                priceColor={priceColor}
              />
            ) : (
              <Price price={product.price} priceColor={priceColor} />
            )}
          </div>
        </div>
      </Link> */
}
