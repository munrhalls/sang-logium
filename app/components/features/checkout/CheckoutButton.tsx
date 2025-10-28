"use client";
import { useBasketStore } from "@/store/store";
import { fetchClientSecret } from "@/app/actions/fetchClientSecret";

export default function CheckoutButton({ setIsCheckoutOpen, setIsLoading }) {
  const basket = useBasketStore((s) => s.basket);

  const publicBasket = basket.map((item) => ({
    stripePriceId: item.stripePriceId,
    quantity: item.quantity,
  }));

  const handleCheckout = async () => {
    await createSessionAndRedirect(publicBasket);
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
