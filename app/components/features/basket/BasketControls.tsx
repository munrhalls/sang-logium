"use client";
import React from "react";
import { useBasketStore } from "@/store";

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
      <button onClick={() => addItem(basketItem)} aria-label="Add to Cart">
        Add to Cart
      </button>
    );
  }

  const canIncrement = item.quantity < product.stock;

  const handleDecrement = () => {
    if (item.quantity === 1) {
      removeItem(_id);
    } else {
      updateQuantity(_id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(_id);
  };

  return (
    <div>
      <button
        aria-label="Increase quantity"
        onClick={() => canIncrement && updateQuantity(_id, item.quantity + 1)}
        disabled={!canIncrement}
      >
        +
      </button>
      <span>{item.quantity}</span>
      <button aria-label="Decrease quantity" onClick={handleDecrement}>
        -
      </button>
      <button aria-label="Remove from basket" onClick={handleRemove}>
        X
      </button>
    </div>
  );
}
