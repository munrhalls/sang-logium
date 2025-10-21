"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking order status
    // In a real app, you might fetch order details here
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>

          {/* Success Message */}
          <h1 className="mb-4 text-center text-3xl font-bold text-gray-900">
            Payment Successful!
          </h1>
          <p className="mb-8 text-center text-lg text-gray-600">
            Thank you for your order. We've received your payment and are
            processing your order.
          </p>

          {/* Session ID */}
          {sessionId && (
            <div className="mb-6 rounded-md bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                <strong>Session ID:</strong>
              </p>
              <p className="break-all font-mono text-xs text-gray-800">
                {sessionId}
              </p>
            </div>
          )}

          {/* What's Next */}
          <div className="mb-8 rounded-lg border border-gray-200 p-6">
            <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
              <Package className="mr-2 h-6 w-6" />
              What happens next?
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
                  1
                </span>
                <span>You'll receive an order confirmation email shortly</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
                  2
                </span>
                <span>
                  We'll process and pack your order within 1-2 business days
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
                  3
                </span>
                <span>
                  You'll receive a shipping notification with tracking details
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/account/orders"
              className="flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              View My Orders
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/"
              className="flex flex-1 items-center justify-center rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Support Message */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Need help? Contact us at{" "}
          <a
            href="mailto:support@yourstore.com"
            className="text-blue-600 hover:underline"
          >
            support@yourstore.com
          </a>
        </p>
      </div>
    </div>
  );
}
