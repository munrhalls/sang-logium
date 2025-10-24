"use client";

import { useState, FormEvent } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentFormProps {
  isLoggedIn: boolean;
}

function PaymentForm({ isLoggedIn }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savePaymentMethod, setSavePaymentMethod] = useState(isLoggedIn);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    // Configure save options based on user preference
    const confirmOptions = {
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/review`,
        payment_method_data:
          savePaymentMethod && isLoggedIn
            ? {
                allow_redisplay: "always" as const,
              }
            : undefined,
      },
    };

    const { error } = await stripe.confirmPayment(confirmOptions);

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message ?? "An error occurred");
      } else {
        setMessage("An unexpected error occurred.");
      }
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "accordion" as const,
    defaultValues: {
      billingDetails: {
        email: "",
      },
    },
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4"
    >
      <PaymentElement id="payment-element" options={paymentElementOptions} />

      {isLoggedIn && (
        <label className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-3">
          <input
            type="checkbox"
            checked={savePaymentMethod}
            onChange={(e) => setSavePaymentMethod(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">
            💳 Save payment method for future purchases
          </span>
        </label>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="mt-4 w-full rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-400"
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {message && (
        <div id="payment-message" className="mt-4 text-red-600">
          {message}
        </div>
      )}
    </form>
  );
}

interface CheckoutFormProps {
  clientSecret: string;
  isLoggedIn: boolean;
}

export default function CheckoutForm({
  clientSecret,
  isLoggedIn,
}: CheckoutFormProps) {
  const appearance = {
    theme: "stripe" as const,
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm isLoggedIn={isLoggedIn} />
    </Elements>
  );
}
