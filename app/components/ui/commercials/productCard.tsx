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
      className="z-30 h-full w-full  max-h-[175px] max-w-[200px] lg:max-h-[350px] lg:max-w-[350px] xl:max-h-[400px] xl:max-w-[400px] bg-white rounded-sm grid grid-rows-[1fr_2fr_1fr]"
    >
      <BrandTitle brand={product.brand} />
      <ProductImage src={product.image} brand={product.brand} />
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
