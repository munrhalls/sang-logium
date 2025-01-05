import Image from "next/image";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

const ProductImage = ({
  product,
}: {
  product: NonNullable<
    GET_COMMERCIALS_BY_FEATURE_QUERYResult[0]["products"]
  >[0];
}) => {
  return (
    <div className="w-16 h-16 sm:w-32 sm:h-32 aspect-square relative">
      <Image
        src={product.image}
        alt={product.name || "Product image"}
        fill
        className="object-cover rounded-lg"
      />
    </div>
  );
};

export default ProductImage;
