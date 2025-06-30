"use client";

import React from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

interface ProductQuantityControlProps {
  /**
   * Current quantity of the product
   * @default 1
   */
  quantity?: number;

  /**
   * Maximum allowed quantity
   * @default 99
   */
  maxQuantity?: number;

  /**
   * Product ID to identify which product is being modified
   */
  productId: string;

  /**
   * Optional className for styling
   */
  className?: string;

  /**
   * Placeholder for handling quantity increase
   * Would be replaced with actual logic when integrating
   */
  onIncrease?: (productId: string) => void;

  /**
   * Placeholder for handling quantity decrease
   * Would be replaced with actual logic when integrating
   */
  onDecrease?: (productId: string) => void;
}

/**
 * Add/subtract buttons for product listings and individual product pages
 *
 * Example:
 * ```tsx
 * // On a product page
 * <ProductQuantityControl
 *   productId="product123"
 *   quantity={2}
 *   maxQuantity={10}
 * />
 * ```
 */
const ProductQuantityControl = ({
  quantity = 1,
  maxQuantity = 99,
  productId,
  className = "",
  onIncrease = () => {},
  onDecrease = () => {},
}: ProductQuantityControlProps) => {
  // Placeholder functions that would be replaced with real functionality
  const handleIncrease = (e: React.MouseEvent) => {
    // Stop the event from propagating to parent elements (like Link)
    e.preventDefault();
    e.stopPropagation();

    if (quantity < maxQuantity) {
      onIncrease(productId);
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    // Stop the event from propagating to parent elements (like Link)
    e.preventDefault();
    e.stopPropagation();

    if (quantity > 1) {
      onDecrease(productId);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={handleDecrease}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-l-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MinusIcon className="h-4 w-4" />
      </button>

      <div className="px-4 py-1 bg-white border-t border-b border-gray-200 text-center min-w-[40px]">
        {quantity}
      </div>

      <button
        onClick={handleIncrease}
        disabled={quantity >= maxQuantity}
        aria-label="Increase quantity"
        className="w-8 h-8 flex items-center justify-center bg-gray-200  rounded-r-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ProductQuantityControl;
