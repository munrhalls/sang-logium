"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FaTimes } from "react-icons/fa";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface EmbeddedCheckoutFormProps {
  publicBasket: Array<{ stripePriceId: string; quantity: number }>;
  onClose: () => void;
}

export default function EmbeddedCheckoutForm({
  publicBasket,
  onClose,
}: EmbeddedCheckoutFormProps) {
  const handleClose = () => {
    onClose();
  };
  const fetchClientSecret = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicBasket }),
      });

      if (!response.ok) {
        const errorDetail = response.statusText || `Status: ${response.status}`;
        throw new Error(
          `Checkout session failed: Server responded with ${errorDetail}`
        );
      }

      const data = await response.json();
      return data.client_secret;
    } catch (error) {
      console.error("Critical error in fetchClientSecret:", error);

      throw new Error(
        "Checkout service temporarily unavailable. Please try again later."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-full w-full max-w-4xl overflow-auto bg-white p-6">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={24} color="gray" />
        </button>
        <div id="checkout">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </div>
  );
}
