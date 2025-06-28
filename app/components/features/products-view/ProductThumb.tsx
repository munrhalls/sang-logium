import { Product } from "@/sanity.types";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent } from "react";
import { imageUrl } from "@/lib/imageUrl";
import ProductQuantityControl from "@/app/components/features/basket/ProductQuantityControl";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useUIStore } from "@/store";

interface ProductThumbProps {
  product: Product;
  saleDiscount?: number;
}

const ProductThumb = ({ product, saleDiscount }: ProductThumbProps) => {
  const basket = useStore((s) => s.basket);
  const addItem = useStore((s) => s.addItem);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeItem = useStore((s) => s.removeItem);

  if (!product.name || !product.image) return null;
  const isOutOfStock = product.stock != null && product.stock <= 0;

  const originalPrice = product.price ?? 0;
  const salePrice =
    saleDiscount && originalPrice
      ? originalPrice - originalPrice * (saleDiscount / 100)
      : originalPrice;

  const showPrice = product.price !== undefined;

  const item = basket.find((i) => i.id === product._id);

  const handleAddToBasket = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addItem({ id: product._id, name: product.name, price: originalPrice });
    } catch (error) {
      console.error("Failed to add item to basket:", error);
    }
  };

  const handleIncreaseQuantity = () => {
    try {
      updateQuantity(product._id, item!.quantity + 1);
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
  };

  const handleDecreaseQuantity = () => {
    try {
      updateQuantity(product._id, item!.quantity - 1);
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
    }
  };

  const handleRemoveItem = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      removeItem(product._id);
    } catch (error) {
      console.error("Failed to remove item from basket:", error);
    }
  };

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

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-gray-900">
              ${salePrice.toFixed(2)}
            </p>
            {saleDiscount && showPrice && (
              <p className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </p>
            )}
          </div>

          {/* Basket Controls */}
          {!isOutOfStock && (
            <div onClick={(e) => e.preventDefault()} className="z-10 relative">
              {item ? (
                <div className="flex items-center">
                  <ProductQuantityControl
                    productId={product._id}
                    quantity={item.quantity}
                    onIncrease={handleIncreaseQuantity}
                    onDecrease={handleDecreaseQuantity}
                    className="scale-90 transform origin-right"
                  />
                  <button
                    onClick={handleRemoveItem}
                    className="ml-1 text-gray-500 hover:text-red-500 transition-colors"
                    aria-label="Remove from basket"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToBasket}
                  className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
                  aria-label="Add to basket"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductThumb;
