"use client";
import React from "react";
import { useBasketStore } from "@/store";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { ShoppingCart, ShoppingBag } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  stock: number;
  price: number;
}

export default function BasketControls({ product }: { product: Product }) {
  const _id = product._id;
  const basket = useBasketStore((s) => s.basket);
  const addItem = useBasketStore((s) => s.addItem);
  const updateQuantity = useBasketStore((s) => s.updateQuantity);
  const removeItem = useBasketStore((s) => s.removeItem);
  const item = basket.find((i) => i._id === _id);

  if (!item) {
    const basketItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
    };
    return (
      <div
        className="flex justify-start items-center gap-4"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            addItem(basketItem);
          }}
          aria-label="Add to Cart"
          className="rounded-lg bg-black text-black p-2 h-14 w-14 flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <span
            className="p-1"
            style={{ display: "inline-flex", lineHeight: 0 }}
          >
            <ShoppingCart className="w-8 h-8 text-white" />
          </span>
        </button>
        <span className="text-black text-2xl font-black border-dashed border-black mb-[1px]">
          Add to cart
        </span>
      </div>
    );
  }

  const canIncrement = item.quantity < product.stock;

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.quantity === 1) {
      removeItem(_id);
    } else {
      updateQuantity(_id, item.quantity - 1);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeItem(_id);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canIncrement) {
      updateQuantity(_id, item.quantity + 1);
    }
  };

  return (
    <div>
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
}
