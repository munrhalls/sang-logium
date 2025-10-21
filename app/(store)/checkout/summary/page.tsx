"use client";
import { useState, useEffect } from "react";
import { useCheckoutStore } from "@/store/checkout";
import ShippingInfo from "./ShippingInfo";
import useInitializeCheckoutCart from "@/app/hooks/useInitializeCheckoutCart";
import OrderDetails from "./OrderDetails";
import { useBasketStore } from "@/store/store";
import PaymentView from "./PaymentView";
import ErrorMessage from "@/app/components/common/ErrorMessage";

export default function Summary() {
  const cartItems = useInitializeCheckoutCart();
  const basketItems = useBasketStore((s) => s.basket);
  const shippingInfo = useCheckoutStore((s) => s.shippingInfo);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
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

  const handleProceedToPayment = () => {
    setShowCheckout(true);
  };
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-black p-3">
        <OrderDetails cartItems={cartItems} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ShippingInfo />
      </div>

      {validationError && <ErrorMessage error={validationError} />}

      {!showCheckout && !isInvalid && (
        <button
          onClick={handleProceedToPayment}
          className="w-full rounded-lg bg-blue-600 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Proceed to Payment
        </button>
      )}

      {showCheckout && !isInvalid && <PaymentView basketItems={basketItems} />}
    </div>
  );
}
