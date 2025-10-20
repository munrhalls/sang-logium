import Link from "next/link";
import DiscountPrice from "./minor/discountPrice";
import Price from "./minor/price";
import BrandTitle from "./minor/brandTitle";
import ProductImage from "./minor/productImage";
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
      className="z-30 grid h-full max-h-[175px] w-full max-w-[200px] grid-rows-[1fr_2fr_1fr] rounded-sm bg-white lg:max-h-[350px] lg:max-w-[350px] xl:max-h-[400px] xl:max-w-[400px]"
    >
      <BrandTitle brand={product.brand} />
      <ProductImage src={product.image} brand={product.brand} />
      <div className="z-40 grid place-content-center">
        {discount ? (
          <DiscountPrice
            price={product.displayPrice}
            discount={discount}
            priceColor={priceColor}
          />
        ) : (
          <Price price={product.displayPrice} priceColor={priceColor} />
        )}
      </div>
    </Link>
  );
};
