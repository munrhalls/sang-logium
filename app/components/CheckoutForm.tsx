"use client";

import { useEffect, useState } from "react";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe-client";

interface CheckoutFormProps {
  clientSecret: string;
}

export default function CheckoutForm({ clientSecret }: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (clientSecret) {
      setIsLoading(false);
    }
  }, [clientSecret]);

  if (isLoading) {
    return (
      <div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          clientSecret,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
