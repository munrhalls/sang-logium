"use client";
import { useState, useEffect } from "react";
import { useCheckoutStore } from "@/store/checkout";
import ShippingInfo from "./ShippingInfo";
import useInitializeCheckoutCart from "@/app/hooks/useInitializeCheckoutCart";
import OrderDetails from "./OrderDetails";
import { getUserPaymentMethods } from "@/app/actions/payment_methods/methods_get";
import { processPaymentWithSavedMethod } from "@/app/actions/checkout/saved_payment";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useBasketStore } from "@/store/store";
import PaymentSegment from "./PaymentSegment";
import ErrorMessage from "@/app/components/common/ErrorMessage";

export default function Summary() {
  //   Where Each Piece Should Go
  // Keep in Summary Component:

  // cartItems from useInitializeCheckoutCart
  // shippingInfo from useCheckoutStore
  // validationError state and its useEffect validation logic
  // showCheckout state (true/false toggle)
  // isInvalid computed value
  // "Proceed to Payment" button that sets showCheckout(true)
  // Rendering of OrderDetails and ShippingInfo components
  // Rendering of ErrorMessage for validation errors

  // Move to New PaymentView Component:

  // isSignedIn from useAuth
  // router from useRouter
  // basketItems from useBasketStore
  // selectedPaymentMethodId state
  // paymentError state
  // Rendering of PaymentSegment component
  // Pass basketItems as prop from Summary

  // Move to New usePaymentMethods Hook:

  // savedPaymentMethods state (currently missing declaration)
  // loadingPaymentMethods state (currently missing declaration)
  // The fetching logic inside handleProceedToPayment (getUserPaymentMethods call)
  // Logic to find and return the default payment method
  // Error handling for failed fetches
  // Return: { methods, isLoading, error, defaultMethodId }

  // Move to New usePaymentProcessor Hook:

  // processingPayment state (currently missing declaration)
  // All logic from handlePayWithSavedCard
  // The processPaymentWithSavedMethod server action call
  // Success redirect logic using router
  // Error handling and setting
  // Return: { processPayment, isProcessing, error, clearError }

  // Delete/Simplify:

  // handleProceedToPayment - becomes just setShowCheckout(true)
  // handlePayWithSavedCard - gets replaced by hook's processPayment function
  // All payment-related state from Summary - moves to <PaymentView></PaymentView>

  const { isSignedIn } = useAuth();
  const router = useRouter();
  const cartItems = useInitializeCheckoutCart();
  const basketItems = useBasketStore((s) => s.basket);
  const shippingInfo = useCheckoutStore((s) => s.shippingInfo);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<
    string | null
  >(null);
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
    // all this logic should be in useHandleSavedPaymentMethods hook
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
      <div className="rounded-lg border border-black p-3">
        <OrderDetails cartItems={cartItems} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ShippingInfo />
      </div>

      {validationError && <ErrorMessage error={validationError} />}

      {paymentError && <ErrorMessage error={paymentError} />}

      {!showCheckout && !isInvalid && (
        <button
          onClick={handleProceedToPayment}
          className="w-full rounded-lg bg-blue-600 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Proceed to Payment
        </button>
      )}

      {showCheckout && !isInvalid && <PaymentSegment />}
    </div>
  );
}
