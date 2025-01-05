import Image from "next/image";
import Link from "next/link";
import { GET_COMMERCIALS_BY_FEATURE_QUERYResult } from "@/sanity.types";

const ProductCard = ({
  product,
}: {
  product: NonNullable<
    GET_COMMERCIALS_BY_FEATURE_QUERYResult[0]["products"]
  >[0];
}) => {
  if (!product) return null;

  const discountPrice =
    product.price - product.price * (product.discount / 100);

  return (
    <Link href={`/product/${product.slug}`} className="group w-full">
      <div className="bg-black/20 rounded-lg p-4">
        <div className="flex flex-row sm:flex-col gap-4">
          {/* Image container */}
          <div className="w-24 h-24 sm:w-full aspect-square relative">
            <Image
              src={product.image}
              alt={product.name || "Product image"}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Content container */}
          <div className="flex flex-col flex-1">
            <p className="font-bold text-lg truncate text-white mb-2">
              {product.name}
            </p>

            {/* Prices container */}
            <div className="flex flex-col sm:flex-row sm:justify-between text-white mt-auto">
              <span className="line-through opacity-60">{product.price}$</span>
              <span className="font-bold">{discountPrice}$</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default ProductCard;
