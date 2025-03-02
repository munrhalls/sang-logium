import Link from "next/link";
import { Product } from "@/sanity.types";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";

interface ProductThumbProps {
  product: Product;
  saleDiscount?: number;
}

const ProductThumb = ({ product, saleDiscount }: ProductThumbProps) => {
  if (!product.name || !product.image) return null;
  const isOutOfStock = product.stock != null && product.stock <= 0;

  const originalPrice = product.price ?? 0;
  const salePrice =
    saleDiscount && originalPrice
      ? originalPrice - originalPrice * (saleDiscount / 100)
      : originalPrice;

  const showPrice = product.price !== undefined;

  return (
    <Link
      href={`/product/${product._id}`}
      className={`group flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden
          ${isOutOfStock ? "opacity-50" : ""}`}
    >
      <div className="p-4">
        <Image
          src={imageUrl(product.image).url()}
          alt={product?.name}
          height={300}
          width={300}
          className="aspect-square rounded-sm"
        />

        <h2 className="pt-2 text-lg font-semibold text-gray-800 ">
          {product.name}
        </h2>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {product.description
            ?.map((block) =>
              block._type === "block"
                ? block.children?.map((child) => child.text).join("")
                : ""
            )
            .join(" ") || "No description available"}
        </p>

        {showPrice && (
          <div className="mt-2 flex items-center gap-2">
            <p className="text-lg font-bold text-gray-900">
              ${salePrice.toFixed(2)}
            </p>
            {saleDiscount && (
              <p className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </p>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductThumb;
