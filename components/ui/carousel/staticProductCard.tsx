import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/imageUrl";

const Price = ({ price }: { price: number }) => {
  return (
    <div>
      <span className="text-white text-xs 2xs:text-lg md:text-xl lg:text-2xl mt-1">
        ONLY
      </span>
      <span className="ml-1 text-lightpromotion text-md 2xs:text-lg md:text-xl lg:text-2xl mb-2">
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
      <span className="text-lightpromotion text-xs 2xs:text-lg md:text-xl lg:text-2xl mt-1">
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
    <div className="bg-black/40 border border-blue-700 font-oswald grid grid-cols-[2fr_3fr] md:grid-cols-[8rem_1fr] lg:grid-cols-[12rem_1fr]">
      <Link href={`/product/${product._id}`} className=" text-white ">
        <Image
          loading="lazy"
          decoding="async"
          quality={100}
          sizes="(max-width: 768px) 36vw, 25vw"
          src={imageUrl(product.image).url()}
          alt={product.name}
          height={80}
          width={80}
          className="rounded-sm md:w-full"
        />
      </Link>

      <span className="text-white md:text-xl">{product.name}</span>

      <div className="flex">
        {discount ? (
          <DiscountPrice price={product.price} discount={discount} />
        ) : (
          <Price price={product.price} />
        )}
      </div>
    </div>
  );
};
