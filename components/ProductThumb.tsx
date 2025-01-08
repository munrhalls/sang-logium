import Link from "next/link";
import { Product } from "@/sanity.types";
interface ProductThumbProps {
  product: Product;
  saleDiscount?: number;
}

const ProductThumb = ({ product, saleDiscount }: ProductThumbProps) => {
  const isOutOfStock = product.stock != null && product.stock <= 0;

  const originalPrice = product.price ?? 0;
  const salePrice =
    saleDiscount && originalPrice
      ? originalPrice - originalPrice * (saleDiscount / 100)
      : originalPrice;

  const showPrice = product.price !== undefined;

  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className={`group flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden
          ${isOutOfStock ? "opacity-50" : ""}`}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
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
