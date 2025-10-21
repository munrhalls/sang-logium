"use client";

import { useState, useEffect } from "react";
import { useCheckoutStore } from "@/store/checkout";
import ShippingInfo from "./ShippingInfo";
import useInitializeCheckoutCart from "@/app/hooks/useInitializeCheckoutCart";
import OrderDetails from "./OrderDetails";
import EmbeddedCheckout from "@/app/components/checkout/EmbeddedCheckout";
import { getUserPaymentMethods } from "@/app/actions/paymentMethods";
import { useAuth } from "@clerk/nextjs";

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
  const { isSignedIn } = useAuth();
  const cartItems = useInitializeCheckoutCart();

  const shippingInfo = useCheckoutStore((s) => s.shippingInfo);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<any[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);

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

  // Load saved payment methods when user proceeds to payment
  const handleProceedToPayment = async () => {
    setShowCheckout(true);

    // Only check for saved payment methods if user is logged in
    if (isSignedIn) {
      setLoadingPaymentMethods(true);
      try {
        const methods = await getUserPaymentMethods();
        setSavedPaymentMethods(methods);

        // Auto-select default payment method if exists
        const defaultMethod = methods.find((m: any) => m.isDefault);
        if (defaultMethod) {
          setSelectedPaymentMethodId(defaultMethod.stripePaymentMethodId);
        }
      } catch (error) {
        console.error("Failed to load payment methods:", error);
      } finally {
        setLoadingPaymentMethods(false);
      }
    }
  };

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
          onClick={handleProceedToPayment}
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

          {/* Save Payment Method Checkbox */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={savePaymentMethod}
                onChange={(e) => setSavePaymentMethod(e.target.checked)}
                className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">
                  Save payment method for future purchases
                </span>
                <p className="mt-1 text-sm text-gray-600">
                  Securely save this card to make checkout faster next time. You
                  can manage saved cards in your account settings.
                </p>
              </div>
            </label>
          </div>

          <EmbeddedCheckout savePaymentMethod={savePaymentMethod} />
        </div>
      )}
    </div>
  );
}
