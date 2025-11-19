"use client";
import { useBasketStore } from "@/store/store";
import EmbeddedCheckoutForm from "./EmbeddedCheckoutForm";

export default function Checkout() {
  const basket = useBasketStore((s) => s.basket);

  const publicBasket = basket.map((item) => ({
    _id: item._id,
    quantity: item.quantity,
  }));

  return <EmbeddedCheckoutForm publicBasket={publicBasket} />;
}
