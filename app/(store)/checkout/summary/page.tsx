"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useCheckoutStore, usePaymentStore } from "@/store/checkout";
import ShippingInfo from "./ShippingInfo";
import PaymentInfo from "./PaymentInfo";
import useInitializeCheckoutCart from "@/app/hooks/useInitializeCheckoutCart";
import OrderDetails from "./OrderDetails";
import CheckoutButton from "./CheckoutButton";

const ErrorMessage = ({ error }: { error: string }) => (
  <div
    className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600"
    role="alert"
    aria-live="assertive"
  >
    {error}
  </div>
);

const Success = () => (
  <div
    className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-600"
    role="alert"
    aria-live="polite"
  >
    Purchase confirmed! Redirecting...
  </div>
);

export default function Summary() {
  const router = useRouter();
  const cartItems = useInitializeCheckoutCart();
  const isMountedRef = useRef(true);

  const shippingInfo = useCheckoutStore((s) => s.shippingInfo);
  const { paymentInfo } = usePaymentStore();
  const clearCart = useCheckoutStore((s) => s.clearCart);

  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!shippingInfo || !paymentInfo || cartItems.length === 0) {
      setValidationError("Order data missing. Please restart checkout.");
    } else {
      setValidationError(null);
    }
  }, [shippingInfo, paymentInfo, cartItems]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (success) {
      timeoutId = setTimeout(() => {
        router.push("/checkout/thank-you");
      }, 300);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [success, router]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const isInvalid =
    !shippingInfo ||
    !paymentInfo ||
    cartItems.length === 0 ||
    validationError !== null;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-black p-3">
        <OrderDetails cartItems={cartItems} />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ShippingInfo />
        <PaymentInfo />
      </div>

      {validationError && <ErrorMessage error={validationError} />}
      {purchaseError && <ErrorMessage error={purchaseError} />}

      {success && <Success />}

      <CheckoutButton isInvalid={isInvalid} />
    </div>
  );
}
