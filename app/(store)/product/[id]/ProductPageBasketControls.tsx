"use client";
import { useBasketStore } from "@/store";
import { useState } from "react";

export default function ProductPageBasketControls({
  product,
}: {
  product: { id: string; name: string; price: number };
}) {
  const basket = useBasketStore((s) => s.basket);
  const addItem = useBasketStore((s) => s.addItem);
  const updateQuantity = useBasketStore((s) => s.updateQuantity);
  const removeItem = useBasketStore((s) => s.removeItem);
  const item = basket.find((i) => i.id === product.id);
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return <div>Basket error fallback</div>;
  }

  if (!item) {
    return (
      <button
        type="button"
        onClick={() => {
          try {
            addItem(product);
          } catch (e) {
            setError("Basket error fallback");
          }
        }}
        aria-label="Add to Cart"
      >
        Add to Cart
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          try {
            updateQuantity(product.id, item.quantity - 1);
          } catch (e) {
            setError("Basket error fallback");
          }
        }}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span>{item.quantity}</span>
      <button
        type="button"
        onClick={() => {
          try {
            updateQuantity(product.id, item.quantity + 1);
          } catch (e) {
            setError("Basket error fallback");
          }
        }}
        aria-label="Increase quantity"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => {
          try {
            removeItem(product.id);
          } catch (e) {
            setError("Basket error fallback");
          }
        }}
        aria-label="Remove from cart"
      >
        X
      </button>
    </div>
  );
}
