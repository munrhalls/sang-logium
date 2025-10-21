"use client";
import { useState, useEffect } from "react";
import { useCheckoutStore } from "@/store/checkout";
import ShippingInfo from "./ShippingInfo";
import useInitializeCheckoutCart from "@/app/hooks/useInitializeCheckoutCart";
import OrderDetails from "./OrderDetails";
import EmbeddedCheckout from "@/app/components/checkout/EmbeddedCheckout";
import { getUserPaymentMethods } from "@/app/actions/payment_methods/methods_get";
import { processPaymentWithSavedMethod } from "@/app/actions/checkout/saved_payment";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useBasketStore } from "@/store/store";
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
  const router = useRouter();
  const cartItems = useInitializeCheckoutCart();
  const basketItems = useBasketStore((s) => s.basket);
  const shippingInfo = useCheckoutStore((s) => s.shippingInfo);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<
    Array<{
      stripePaymentMethodId: string;
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
      isDefault?: boolean;
    }>
  >([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
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
  const handleProceedToPayment = async () => {
    setShowCheckout(true);
    if (isSignedIn) {
      console.log("signed in", isSignedIn);
      setLoadingPaymentMethods(true);
      try {
        const methods = await getUserPaymentMethods();
        console.log("Fetched payment methods:", methods);
        setSavedPaymentMethods(methods);
        const defaultMethod = methods.find(
          (m: { isDefault?: boolean }) => m.isDefault
        );
        console.log("defaultMethod", defaultMethod);
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
  const handlePayWithSavedCard = async () => {
    if (!selectedPaymentMethodId) {
      setPaymentError("Please select a payment method");
      return;
    }
    setProcessingPayment(true);
    setPaymentError(null);
    try {
      const items = basketItems.map((item) => ({
        priceId: item.stripePriceId,
        quantity: item.quantity,
      }));
      const result = await processPaymentWithSavedMethod(
        items,
        selectedPaymentMethodId
      );
      if (result.success) {
        router.push(`/success?payment_intent=${result.paymentIntentId}`);
      } else {
        throw new Error("Payment processing failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again or use a different payment method."
      );
    } finally {
      setProcessingPayment(false);
    }
  };
  return (
    <div className="space-y-6">
      {}
      <div className="rounded-lg border border-black p-3">
        <OrderDetails cartItems={cartItems} />
      </div>
      {}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ShippingInfo />
      </div>
      {}
      {validationError && <ErrorMessage error={validationError} />}
      {}
      {paymentError && <ErrorMessage error={paymentError} />}
      {}
      {!showCheckout && !isInvalid && (
        <button
          onClick={handleProceedToPayment}
          className="w-full rounded-lg bg-blue-600 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Proceed to Payment
        </button>
      )}
      {}
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
          {}
          {isSignedIn && savedPaymentMethods.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">
                Select Payment Method
              </h3>
              {}
              {savedPaymentMethods.map((method) => (
                <div
                  key={method.stripePaymentMethodId}
                  onClick={() =>
                    setSelectedPaymentMethodId(method.stripePaymentMethodId)
                  }
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    selectedPaymentMethodId === method.stripePaymentMethodId
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={
                          selectedPaymentMethodId ===
                          method.stripePaymentMethodId
                        }
                        onChange={() =>
                          setSelectedPaymentMethodId(
                            method.stripePaymentMethodId
                          )
                        }
                        className="h-4 w-4 text-blue-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {method.brand.toUpperCase()} •••• {method.last4}
                          {method.isDefault && (
                            <span className="ml-2 text-xs text-blue-600">
                              ⭐ Default
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Expires {method.expMonth}/{method.expYear}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {}
              <div
                onClick={() => setSelectedPaymentMethodId(null)}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  selectedPaymentMethodId === null
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={selectedPaymentMethodId === null}
                    onChange={() => setSelectedPaymentMethodId(null)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      + Add New Card
                    </div>
                    <div className="text-sm text-gray-500">
                      Use a different payment method
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {}
          {loadingPaymentMethods && (
            <div className="py-8 text-center text-gray-600">
              Loading payment methods...
            </div>
          )}
          {}
          {!loadingPaymentMethods &&
            (savedPaymentMethods.length === 0 ||
              selectedPaymentMethodId === null) && (
              <>
                {}
                {isSignedIn && (
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
                          Securely save this card to make checkout faster next
                          time. You can manage saved cards in your account
                          settings.
                        </p>
                      </div>
                    </label>
                  </div>
                )}
                <EmbeddedCheckout savePaymentMethod={savePaymentMethod} />
              </>
            )}
          {}
          {!loadingPaymentMethods &&
            selectedPaymentMethodId !== null &&
            savedPaymentMethods.length > 0 && (
              <button
                onClick={handlePayWithSavedCard}
                disabled={processingPayment}
                className="w-full rounded-lg bg-blue-600 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processingPayment ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Processing Payment...
                  </span>
                ) : (
                  "Pay with Selected Card"
                )}
              </button>
            )}
        </div>
      )}
    </div>
  );
}
