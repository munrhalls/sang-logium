import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";

const Price = ({ price }: { price: number }) => {
  return (
    <div>
      <span className="text-white font-bold sm:font-black text-xs sm:text-lg md:text-xl lg:text-2xl ">
        ONLY
      </span>
      <span className="ml-1 text-lightpromotion font-bold sm:font-black text-md sm:text-lg md:text-xl lg:text-2xl ">
        ${price.toFixed(2)}
      </span>
    </div>
  );
};

const DiscountPrice = ({
  price,
  discount,
}: {
  price: number;
  discount: number;
}) => {
  const discountPrice = (discount / 100) * price;

  return (
    <>
      <span className="text-gray-400">${price.toFixed(2)}</span>
      <span className="text-lightpromotion font-bold sm:font-black text-xs sm:text-lg md:text-xl lg:text-2xl mt-1">
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
};

export const ProductCard = ({ product, discount }: Props) => {
  return (
    <div className="/* PRODUCT CARD */ h-full min-h-0 grid gap-2 grid-cols-[1fr_3fr] bg-black/40 text-white rounded-sm font-oswald">
      <Link
        href={`/product/${product._id}`}
        className=" text-white relative aspect-square w-[clamp(60px,70%,100px)] place-self-center"
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
        <span className="z-40 max-w-full text-white truncate font-bold text-xs md:text-md">
          {product.name}
        </span>

        <div className="z-40 flex ">
          {discount ? (
            <DiscountPrice price={product.price} discount={discount} />
          ) : (
            <Price price={product.price} />
          )}
        </div>
      </div>
    </div>
  );
};
