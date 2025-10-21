"use client";
import { createEmbeddedCheckoutSession } from "@/app/actions/checkout/session";
import { useBasketStore } from "@/store/store";
import { ShoppingCart } from "lucide-react";

export default function CheckoutButton() {
  const basketItems = useBasketStore((s) => s.basket);

  const items = basketItems.map((item) => ({
    priceId: item.stripePriceId,
    quantity: item.quantity,
  }));

  return (
    <form action={() => createEmbeddedCheckoutSession(items)}>
      <button
        className="btn btn-primary w-full rounded-lg bg-yellow-400 py-4 font-black text-black hover:bg-yellow-500 disabled:opacity-50"
        type="submit"
      >
        <ShoppingCart className="mr-2 inline h-4 w-4" />
        Checkout ({items.length} items)
      </button>
    </form>
  );
}
