"use client";
import { useStore } from "@/store";

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

  if (!item) {
    return (
      <button
        type="button"
        onClick={() => addItem(product)}
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
        onClick={() => updateQuantity(product.id, item.quantity - 1)}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span>{item.quantity}</span>
      <button
        type="button"
        onClick={() => updateQuantity(product.id, item.quantity + 1)}
        aria-label="Increase quantity"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => removeItem(product.id)}
        aria-label="Remove from cart"
      >
        X
      </button>
    </div>
  );
}
