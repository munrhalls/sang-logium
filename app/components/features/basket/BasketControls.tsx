"use client";
import React from "react";
import { useBasketStore } from "@/store";

interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
}

export default function BasketControls({ product }: { product: Product }) {
  const basket = useBasketStore((s) => s.basket);
  const addItem = useBasketStore((s) => s.addItem);
  const updateQuantity = useBasketStore((s) => s.updateQuantity);
  const removeItem = useBasketStore((s) => s.removeItem);
  const item = basket.find((i) => i.id === product.id);
  console.log("item", item);
  if (!item) {
    return (
      <button onClick={() => addItem(product)} aria-label="Add to Cart">
        Add to Cart
      </button>
    );
  }

  const canIncrement = item.quantity < product.stock;

  const handleDecrement = () => {
    if (item.quantity === 1) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, item.quantity - 1);
    }
  };

  return (
    <div>
      <button
        aria-label="Increase quantity"
        onClick={() =>
          canIncrement && updateQuantity(product.id, item.quantity + 1)
        }
        disabled={!canIncrement}
      >
        +
      </button>
      <span>{item.quantity}</span>
      <button aria-label="Decrease quantity" onClick={handleDecrement}>
        -
      </button>
    </div>
  );
}
