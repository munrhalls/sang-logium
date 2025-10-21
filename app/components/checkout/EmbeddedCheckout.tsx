"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout as StripeEmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { createEmbeddedCheckoutSession } from "@/app/actions/checkout";
import { useBasketStore } from "@/store/store";

/**
 * Embedded Stripe Checkout Component
 * Keeps users on your site during checkout
 */
export default function EmbeddedCheckout({
  savePaymentMethod = false,
}: {
  savePaymentMethod?: boolean;
}) {
  const basketItems = useBasketStore((s) => s.basket);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const hasInitialized = useRef(false);

  // Memoize Stripe promise to prevent recreating on every render
  const stripePromise = useMemo(
    () => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!),
    []
  );

  // Memoize items to prevent unnecessary re-renders
  const items = useMemo(
    () =>
      basketItems.map((item) => ({
        priceId: item.stripePriceId,
        quantity: item.quantity,
      })),
    [basketItems]
  );

  /**
   * Fetch the client secret ONCE when component mounts
   */
  useEffect(() => {
    // Only fetch if we haven't initialized yet and don't have a client secret
    if (hasInitialized.current || clientSecret) {
      return;
    }

    hasInitialized.current = true;

    const initCheckout = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await createEmbeddedCheckoutSession(items, {
          savePaymentMethod,
        });

        if (!result.clientSecret) {
          throw new Error("Failed to create checkout session");
        }

        setClientSecret(result.clientSecret);
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to initialize checkout";
        setError(errorMessage);
        setLoading(false);
        hasInitialized.current = false; // Allow retry
      }
    };

    initCheckout();
  }, [items, clientSecret, savePaymentMethod]);

  // Cleanup: reset client secret when component unmounts
  useEffect(() => {
    return () => {
      setClientSecret(null);
    };
  }, []);

  const options = useMemo(
    () => ({
      clientSecret: clientSecret || "",
    }),
    [clientSecret]
  );

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
            setClientSecret(null);
            hasInitialized.current = false;
            // Re-trigger initialization
            window.location.reload();
          }}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading || !clientSecret) {
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
