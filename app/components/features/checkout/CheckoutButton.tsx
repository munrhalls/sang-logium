"use client";
import { useState } from "react";
import { useBasketStore } from "@/store/store";
import EmbeddedCheckoutForm from "./EmbeddedCheckoutForm";

export default function CheckoutButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const basket = useBasketStore((s) => s.basket);

  // Prepare public basket data
  const publicBasket = basket.map((item) => ({
    stripePriceId: item.stripePriceId,
    quantity: item.quantity,
  }));

  const handleCheckout = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleCheckout}
        className="flex w-full items-center justify-center rounded-sm bg-black py-4 text-lg font-medium text-white transition-colors hover:bg-gray-800"
      >
        {`Checkout (${basket.length} items)`}
      </button>

      {isModalOpen && <EmbeddedCheckoutForm publicBasket={publicBasket} />}
    </>
  );
}
