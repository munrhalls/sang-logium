"use client";
import { useBasketStore } from "@/store/store";

export default function CheckoutButton() {
  const basket = useBasketStore((s) => s.basket);

  const handleCheckout = async () => {
    if (basket.length === 0) {
      console.error("Basket is empty and checkout btn enabled.");
    }
    // needs to go to /checkout server page and transport basket data to /checkout server page
  };

  return (
    <form action={handleCheckout} className="w-full">
      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-sm bg-black py-4 text-lg font-medium text-white transition-colors hover:bg-gray-800"
      >
        {`Checkout (${basket.length} items)`}
      </button>
    </form>
  );
}
