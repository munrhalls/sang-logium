import Link from "next/link";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";
import ProductContent from "./productContent";
import ProductImage from "./productImage";

const ProductCard = ({
  product,
}: {
  product: NonNullable<
    GET_COMMERCIALS_BY_FEATURE_QUERYResult[0]["products"]
  >[0];
}) => {
  if (!product) return null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="flex-1 h-full flex justify-start items-stretch z-40 sm:flex-col"
    >
      <ProductImage product={product} />
      <ProductContent product={product} />
    </Link>
  );
};
export default ProductCard;
