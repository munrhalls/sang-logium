"use client";

import { useState, useEffect } from "react";
import { useCheckoutStore, usePaymentStore } from "@/store/checkout";
import ShippingInfo from "./ShippingInfo";
import useInitializeCheckoutCart from "@/app/hooks/useInitializeCheckoutCart";
import OrderDetails from "./OrderDetails";
import EmbeddedCheckout from "@/app/components/checkout/EmbeddedCheckout";

const ErrorMessage = ({ error }: { error: string }) => (
  <div
    className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600"
    role="alert"
    aria-live="assertive"
  >
    {error}
  </div>
);

export default function Summary() {
  const cartItems = useInitializeCheckoutCart();

  const shippingInfo = useCheckoutStore((s) => s.shippingInfo);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);

  useEffect(() => {
    if (!shippingInfo || cartItems.length === 0) {
      setValidationError("Order data missing. Please restart checkout.");
      setShowCheckout(false);
    } else {
      setValidationError(null);
    }
  }, [shippingInfo, cartItems]);

  const isInvalid =
    !shippingInfo || cartItems.length === 0 || validationError !== null;

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="rounded-lg border border-black p-3">
        <OrderDetails cartItems={cartItems} />
      </div>

      {/* Shipping & Payment Info */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ShippingInfo />
      </div>

      {/* Validation Error */}
      {validationError && <ErrorMessage error={validationError} />}

      {/* Proceed to Payment Button */}
      {!showCheckout && !isInvalid && (
        <button
          onClick={() => setShowCheckout(true)}
          className="w-full rounded-lg bg-blue-600 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Proceed to Payment
        </button>
      )}

      {/* Embedded Stripe Checkout */}
      {showCheckout && !isInvalid && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold">Complete Payment</h2>
            <button
              onClick={() => setShowCheckout(false)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Summary
            </button>
          </div>
          <EmbeddedCheckout />
        </div>
      )}
    </div>
  );
}
