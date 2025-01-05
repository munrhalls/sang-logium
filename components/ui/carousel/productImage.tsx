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
    <div className="mr-4 w-20 h-20 2xs:w-24 2xs:h-24 sm:w-32 sm:h-32  md:w-32 md:h-32 lg:w-60 lg:h-60 xl:w-60 xl:h-60 aspect-square relative">
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
