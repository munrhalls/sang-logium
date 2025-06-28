"use client";
import { useUIStore } from "@/store";
import { useState } from "react";

export default function ProductPageBasketControls({
  product,
}: {
  product: { id: string; name: string; price: number };
}) {
  const basket = useStore((s) => s.basket);
  const addItem = useStore((s) => s.addItem);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeItem = useStore((s) => s.removeItem);
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
