"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout as StripeEmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { createEmbeddedCheckoutSession } from "@/app/actions/checkout";
import { useBasketStore } from "@/store/store";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

/**
 * Embedded Stripe Checkout Component
 * Keeps users on your site during checkout
 */
export default function EmbeddedCheckout() {
  const basketItems = useBasketStore((s) => s.basket);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Prepare items for checkout
  const items = basketItems.map((item) => ({
    priceId: item.stripePriceId,
    quantity: item.quantity,
  }));

  /**
   * Fetch the client secret when component mounts
   * This is called automatically by EmbeddedCheckoutProvider
   */
  const fetchClientSecret = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await createEmbeddedCheckoutSession(items);

      if (!result.clientSecret) {
        throw new Error("Failed to create checkout session");
      }
      setLoading(false);
      return result.clientSecret;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to initialize checkout";
      setError(errorMessage);
      throw err;
    }
  };

  const options = {
    fetchClientSecret,
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-6">
        <h3 className="mb-2 text-lg font-semibold text-red-800">
          Checkout Error
        </h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => {
            setError(null);
            window.location.reload();
          }}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 text-black">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <StripeEmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
