import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";
// import PriceLineCross from "@/public/icons/PriceLineCross.svg";
import DiscountPrice from "./discountPrice";
import Price from "./price";
import BrandTitle from "./brandTitle";

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
    <Link
      href={`/product/${product._id}`}
      className="z-30 h-full w-full  max-h-[175px] max-w-[200px] lg:max-h-[350px] lg:max-w-[350px] xl:max-h-[400px] xl:max-w-[400px] bg-white rounded-sm grid grid-rows-[1fr_2fr_1fr]"
    >
      <BrandTitle brand={product.brand} />
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
    </Link>
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
