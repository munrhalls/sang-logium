import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";

const Price = ({
  price,
  priceColor,
}: {
  price: number;
  priceColor: string;
}) => {
  return (
    <div>
      <span className="text-white font-bold sm:font-black text-xs sm:text-lg md:text-xl  ">
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
  const discountPrice = (discount / 100) * price;

  return (
    <>
      <span className="text-gray-400">${price.toFixed(2)}</span>
      <span
        className="text-lightpromotion font-bold sm:font-black text-xs sm:text-lg md:text-xl  mt-1"
        style={{ color: priceColor }}
      >
        ${discountPrice?.toFixed(2)}
      </span>
    </>
  );
};

export type ProductProps = {
  _id: string;
  name: string;
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
    <div className="/* PRODUCT CARD */ z-30 h-full min-h-0 grid gap-2 grid-cols-[1fr_3fr] md:grid-col-[2fr_3fr] bg-black/40 text-white rounded-sm font-oswald">
      <Link
        href={`/product/${product._id}`}
        className=" text-white relative aspect-square w-[clamp(60px,70%,100px)] md:w-[clamp(60px,50%,200px)] place-self-center"
      >
        <Image
          loading="lazy"
          decoding="async"
          quality={100}
          sizes="(max-width: 768px) 36vw, 25vw"
          src={imageUrl(product.image).url()}
          alt={product.name}
          height={60}
          width={60}
          className="z-40 h-full w-full absolute inset-0 aspect-square object-cover rounded-sm"
        />
      </Link>

      <div className="z-40 min-w-0 max-w-full flex flex-col justify-center items-start">
        <span className="z-40 max-w-full text-white truncate font-bold text-xs md:text-lg md:mb-4 xl:text-2xl">
          {product.name}
        </span>

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
    </div>
  );
};
