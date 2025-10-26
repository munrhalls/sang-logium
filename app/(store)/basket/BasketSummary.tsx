"use client";
import React from "react";
import { useBasketStore } from "@/store/store";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createCheckoutSession } from "@/app/actions/createCheckoutSession";
import { useUser } from "@clerk/nextjs";
import Loader from "@/app/components/common/Loader";

type Metadata = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
};

export default function BasketSummary() {
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { user, isSignedIn: signedIn } = useUser();
  const basket = useBasketStore((s) => s.basket);
  const getTotal = useBasketStore((s) => s.getTotal);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loader />;
  }

  const shipping = 15.99;
  const subtotal = getTotal();
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    console.log("proceed to checkout click");
    if (!signedIn) return;
    console.log("proceed to checkout click after sign in");

    setIsLoading(true);

    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "Uknown",
        customerEmail: user?.primaryEmailAddress?.emailAddress ?? "Unknown",
        clerkUserId: user!.id,
      };

      const groupedBasketItems = basket.map((item) => ({
        product: item,
        quantity: item.quantity,
      }));

      const checkoutUrl = await createCheckoutSession(
        groupedBasketItems,
        metadata
      );

      if (checkoutUrl) {
        console.log("??");
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-6 border-b border-gray-200 pb-4 text-lg font-bold">
        Basket Summary
      </h2>
      <div className="mb-6 space-y-4">
        <div className="flex justify-between text-gray-700">
          <div>
            Subtotal ({basket.reduce((sum, item) => sum + item.quantity, 0)}{" "}
            items)
          </div>
          <div className="font-medium">${subtotal.toFixed(2)}</div>
        </div>
        <div className="flex justify-between text-gray-700">
          <div>Shipping</div>
          <div className="font-medium">${shipping.toFixed(2)}</div>
        </div>
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex justify-between text-xl font-bold">
            <div>Total</div>
            <div>${total.toFixed(2)}</div>
          </div>
          <div className="mt-1 text-xs text-gray-500">Including VAT</div>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <button
          onClick={handleCheckout}
          className="flex w-full items-center justify-center rounded-sm bg-black py-4 text-lg font-medium text-white transition-colors hover:bg-gray-800"
        >
          Proceed to Checkout
        </button>
      )}

      <div className="mt-4 hidden lg:block">
        <Link
          href="/products"
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="flex flex-col gap-2 text-xs text-gray-500">
          <p className="font-medium text-gray-700">We Accept:</p>
          <div className="flex items-center gap-2">
            <div className="h-6 w-10 rounded bg-gray-200"></div>
            <div className="h-6 w-10 rounded bg-gray-200"></div>
            <div className="h-6 w-10 rounded bg-gray-200"></div>
            <div className="h-6 w-10 rounded bg-gray-200"></div>
          </div>
          <p className="mt-2">Secure checkout powered by Stripe</p>
        </div>
      </div>
    </>
  );
}
