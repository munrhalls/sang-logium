"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const paymentIntent = searchParams.get("payment_intent");
    const paymentIntentClientSecret = searchParams.get(
      "payment_intent_client_secret"
    );
    const redirectStatus = searchParams.get("redirect_status");

    if (!paymentIntent || !paymentIntentClientSecret) {
      setStatus("error");
      setMessage("Missing payment information");
      return;
    }

    if (redirectStatus === "succeeded") {
      setStatus("success");
      setMessage("Payment successful! Thank you for your order.");
    } else {
      setStatus("error");
      setMessage("Payment failed. Please try again.");
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-lg">
        {status === "loading" && (
          <div className="text-center">
            <div className="mb-4 text-lg">Processing payment...</div>
            <div className="spinner mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="mb-4 text-6xl">✓</div>
            <h1 className="mb-4 text-2xl font-bold text-green-600">
              Payment Successful!
            </h1>
            <p className="mb-6 text-gray-600">{message}</p>
            <div className="space-y-2">
              <Link
                href="/account/orders"
                className="block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                View Orders
              </Link>
              <Link
                href="/"
                className="block rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="mb-4 text-6xl">✗</div>
            <h1 className="mb-4 text-2xl font-bold text-red-600">
              Payment Failed
            </h1>
            <p className="mb-6 text-gray-600">{message}</p>
            <div className="space-y-2">
              <Link
                href="/checkout/payment"
                className="block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Try Again
              </Link>
              <Link
                href="/basket"
                className="block rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Back to Basket
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
