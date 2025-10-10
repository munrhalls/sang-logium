"use client";
import React from "react";
import { useBasketStore } from "@/store";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ShoppingCart } from "lucide-react";
import { BasketItem } from "@/store";
const BasketControls = React.memo(
  function BasketControls({ product }: { product: BasketItem }) {
    const _hasHydrated = useBasketStore((s) => s._hasHydrated);
    const _id = product._id;
    const item = useBasketStore((s) =>
      s.basket.find((i) => i._id === product._id)
    );
    const addItem = useBasketStore((s) => s.addItem);
    const updateQuantity = useBasketStore((s) => s.updateQuantity);
    const removeItem = useBasketStore((s) => s.removeItem);
    if (!item) {
      const basketItem = {
        _id: product._id,
        stock: product.stock,
        name: product.name,
        price: product.price,
        quantity: 1,
      };
      return (
        <div
          className="flex flex-col justify-start items-center "
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(basketItem);
            }}
            aria-label="Add to Cart"
            className="mt-2 rounded-lg bg-black text-black h-10 w-10 flex flex-col items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <span
              className="p-1"
              style={{ display: "inline-flex", lineHeight: 0 }}
            >
              <ShoppingCart className="w-6 h-6 text-white" />
            </span>
          </button>
        </div>
      );
    }
    const canIncrement = item.quantity < product.stock;
    const handleDecrement = (_e: React.MouseEvent) => {
      if (item.quantity === 1) {
        removeItem(_id);
      } else {
        updateQuantity(_id, item.quantity - 1);
      }
    };
    const handleRemove = (_e: React.MouseEvent) => {
      removeItem(_id);
    };
    const handleIncrement = (_e: React.MouseEvent) => {
      if (canIncrement) {
        updateQuantity(_id, item.quantity + 1);
      }
    };
    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="font-bold text-lg">Purchase quantity:</div>
        <div className="flex items-center gap-x-2">
          <button
            aria-label="Increase quantity"
            onClick={handleIncrement}
            disabled={!canIncrement}
            className="bg-black text-white rounded p-2 h-9 w-9 flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            +
          </button>
          <span className="font-black w-6 text-center">{item.quantity}</span>
          <button
            aria-label="Decrease quantity"
            onClick={handleDecrement}
            className="bg-black text-white rounded p-2 h-9 w-9 flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            -
          </button>
          <button
            aria-label="Remove from basket"
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 transition-colors rounded p-2 h-9 w-9 flex items-center justify-center"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.product._id === nextProps.product._id;
  }
);
export default BasketControls;
