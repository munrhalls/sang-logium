"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCheckoutStore, usePaymentStore } from "@/store/checkout";
import { useEffect } from "react";
import ShippingInfo from "./ShippingInfo";
import PaymentInfo from "./PaymentInfo";
import useInitializeCheckoutCart from "@/app/hooks/useInitializeCheckoutCart";
import OrderDetails from "./OrderDetails";
import Loader from "./Loader";

const Error = ({ error }: { error: string }) => (
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
``;
export default function Summary() {
  const router = useRouter();
  const cartItems = useInitializeCheckoutCart();

  const shippingInfo = useCheckoutStore((s) => s.shippingInfo);
  const { paymentInfo } = usePaymentStore();
  const clearCart = useCheckoutStore((s) => s.clearCart);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (
      (!shippingInfo || !paymentInfo || cartItems.length === 0) &&
      error === null
    ) {
      setError("Order data missing. Please restart checkout.");
    } else if (
      shippingInfo &&
      paymentInfo &&
      cartItems.length > 0 &&
      error !== null
    ) {
      setError(null);
    }
  }, [shippingInfo, paymentInfo, cartItems, error]);

  const handleBuy = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!shippingInfo || !paymentInfo || cartItems.length === 0) {
        throw new Error("Order data missing. Please restart checkout.");
      }

      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.1) {
            reject(new Error("Purchase failed. Please try again."));
          } else {
            resolve(true);
          }
        }, 1000);
      });

      clearCart();
      setSuccess(true);

      setTimeout(() => {
        router.push("/checkout/thank-you");
      }, 300);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Purchase failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isInvalid =
    !shippingInfo || !paymentInfo || cartItems.length === 0 || error !== null;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-black p-3">
        <OrderDetails cartItems={cartItems} />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ShippingInfo />
        <PaymentInfo />
      </div>

      {error && <Error error={error} />}

      {success && <Success />}

      <button
        onClick={handleBuy}
        disabled={loading || isInvalid}
        className="w-full rounded-lg bg-yellow-600 px-6 py-3 text-center font-black uppercase tracking-wider text-black transition duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black sm:w-auto"
        aria-busy={loading}
      >
        <span className="flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          {loading ? <Loader /> : "BUY"}
        </span>
      </button>
    </div>
  );
}
