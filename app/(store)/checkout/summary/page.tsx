"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useCheckoutStore, usePaymentStore } from "@/store/checkout";
import { useEffect } from "react";
import { useBasketStore } from "@/store/store";
import ShippingInfo from "./ShippingInfo";
import PaymentInfo from "./PaymentInfo";

const { getState: get, setState: set } = useCheckoutStore;

export default function Summary() {
  const router = useRouter();
  const shippingInfo = useCheckoutStore((s) => s.shippingInfo);
  const cartItems = useCheckoutStore((s) => s.cartItems);
  const clearCart = useCheckoutStore((s) => s.clearCart);
  const { paymentInfo } = usePaymentStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const initCartFromBasket = () => {
      const basketItems = useBasketStore.getState().basket;
      if (basketItems.length > 0) {
        const formattedItems = basketItems.map((item) => ({
          id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }));
        set({ cartItems: formattedItems });
      }
    };
    initCartFromBasket();
    console.log("Cart items after init:", get().cartItems);
  }, []);
  console.log("CART ITEMS IN SUMMARY:", cartItems);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = useMemo(() => {
    return subtotal * 0.08;
  }, [subtotal]);

  const grandTotal = useMemo(() => {
    return subtotal + tax;
  }, [subtotal, tax]);

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
        <h2 className="mb-4 border-b border-gray-200 pb-2 text-lg font-bold">
          Order Summary
        </h2>

        {cartItems.length > 0 ? (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-gray-100 pb-2"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="space-y-2 pt-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-2 text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="font-black text-gray-700">No items in cart</p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ShippingInfo />
        <PaymentInfo />
      </div>

      {error && (
        <div
          className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-600"
          role="alert"
          aria-live="polite"
        >
          Purchase confirmed! Redirecting...
        </div>
      )}

      <div>
        <button
          onClick={handleBuy}
          disabled={loading || isInvalid}
          className="w-full rounded-lg bg-black px-6 py-3 text-center font-semibold uppercase tracking-wider text-white transition duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black sm:w-auto"
          aria-busy={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Confirm Purchase"
          )}
        </button>
      </div>
    </div>
  );
}
