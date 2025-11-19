"use client";
import { useBasketStore } from "@/store/store";
import EmbeddedCheckoutForm from "./EmbeddedCheckoutForm";
import { BasketCheckoutItem } from "./../checkout.types";

export default function Checkout() {
  const basket = useBasketStore((s) => s.basket);

  const publicBasket: BasketCheckoutItem[] = basket.map((item) => ({
    _id: item._id,
    quantity: item.quantity,
  }));

  return <EmbeddedCheckoutForm publicBasket={publicBasket} />;
}
