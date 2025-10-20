"use client";

import { createCartCheckoutSession } from "@/app/actions/checkout";
import { useBasketStore } from "@/store/store";
import { useCheckoutStore } from "@/store/checkout";

export function CheckoutButton() {
  const basketItems = useBasketStore((s) => s.basket);
  const items = basketItems.map((item) => ({
    priceId: item.priceId,
    quantity: item.quantity,
  }));

  return (
    <form action={() => createCartCheckoutSession(items)}>
      <button type="submit">Checkout ({items.length} items)</button>
    </form>
  );
}
