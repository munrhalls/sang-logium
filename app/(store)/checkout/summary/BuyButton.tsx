"use client";

import { createCartCheckoutSession } from "@/app/actions/checkout";
import { useBasketStore } from "@/store/store";
import { useCheckoutStore } from "@/store/checkout";

export function CheckoutButton() {
  const items = useBasketStore((s) => s.basket);
  return (
    <form action={() => createCartCheckoutSession(items)}>
      <button type="submit">Checkout ({items.length} items)</button>
    </form>
  );
}
