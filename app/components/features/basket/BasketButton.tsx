"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface BasketButtonProps {
  /**
   * The number of items in the basket
   * @default 0
   */
  itemCount?: number;
  
  /**
   * Optional className to extend styling
   */
  className?: string;
}

/**
 * Navigation button showing item count for the header
 * 
 * Example:
 * ```tsx
 * // In header component
 * <BasketButton itemCount={3} />
 * ```
 */
const BasketButton = ({ itemCount = 0, className = "" }: BasketButtonProps) => {
  return (
    <Link 
      href="/basket" 
      className={`relative grid grid-rows-[1fr_auto] place-items-center text-white ${className}`}
    >
      <div className="grid place-content-center relative">
        <ShoppingCartIcon height={24} width={24} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </div>
      <span>Basket</span>
    </Link>
  );
};

export default BasketButton;