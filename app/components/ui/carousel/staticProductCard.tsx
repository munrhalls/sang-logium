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
    <div className="/* product card */ h-full z-40 bg-black/40 text-white rounded-sm font-oswald grid">
      <div className="bg-blue-700 grid grid-cols-[33%_2fr]">
        <div className="bg-black h-full w-full "></div>
        <div className="bg-pink-700 h-full w-full "></div>
      </div>
      {/* <Link
        href={`/product/${product._id}`}
        className=" text-white grid place-content-start"
      >
        <Image
          loading="lazy"
          decoding="async"
          quality={100}
          sizes="(max-width: 768px) 36vw, 25vw"
  src="/api/placeholder/80/80"
          alt={product.name}
          height={80}
          width={80}
          className="object-contain rounded-sm md:w-full"
        />
      </Link>

      <span className="text-white truncate font-bold text-xs md:text-md">
        {product.name}
      </span>

      <div className="flex row-start-2 col-start-2">
        {discount ? (
          <DiscountPrice price={product.price} discount={discount} />
        ) : (
          <Price price={product.price} />
        )}
      </div> */}
    </div>
  );
};
