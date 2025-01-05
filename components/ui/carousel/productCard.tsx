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
    <div className="flex justify-center items-center">
      <Link href={`/product/${product.slug}`}>
        <ProductImage product={product} />
        <ProductContent product={product} />
      </Link>
    </div>
  );
};
export default ProductCard;
