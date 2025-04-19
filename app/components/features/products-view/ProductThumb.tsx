import { Product } from "@/sanity.types";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent, useState } from "react";
import { imageUrl } from "@/lib/imageUrl";
import ProductQuantityControl from "@/app/components/basket/ProductQuantityControl";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ProductThumbProps {
  product: Product;
  saleDiscount?: number;
}

const ProductThumb = ({ product, saleDiscount }: ProductThumbProps) => {
  if (!product.name || !product.image) return null;
  const isOutOfStock = product.stock != null && product.stock <= 0;
  
  // Local state to track if item is in basket and quantity
  // In real implementation, this would come from your basket state management
  const [inBasket, setInBasket] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const originalPrice = product.price ?? 0;
  const salePrice =
    saleDiscount && originalPrice
      ? originalPrice - originalPrice * (saleDiscount / 100)
      : originalPrice;

  const showPrice = product.price !== undefined;
  
  // Placeholder functions that would connect to your basket state management
  const handleAddToBasket = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent navigation from Link
    e.stopPropagation(); // Prevent event bubbling
    setInBasket(true);
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
            <div 
              onClick={(e) => e.preventDefault()} 
              className="z-10 relative"
            >
              {inBasket ? (
                <div className="flex items-center">
                  <ProductQuantityControl
                    productId={product._id}
                    quantity={quantity}
                    onIncrease={(id) => {
                      setQuantity(prev => Math.min(prev + 1, 99));
                    }}
                    onDecrease={(id) => {
                      setQuantity(prev => Math.max(prev - 1, 1));
                    }}
                    className="scale-90 transform origin-right"
                  />
                  
                  {/* Remove from basket button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setInBasket(false);
                      setQuantity(1);
                    }}
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
