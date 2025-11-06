"use client";
import Link from "next/link";
import { useCheckout } from "@/app/(store)/checkout/layout";
import { redirect } from "next/navigation";

export default function Page() {
  const { shippingAPIValidation, shippingAddress } = useCheckout();

  if (!shippingAPIValidation?.status) {
    redirect("/checkout/shipping");
  }

  console.log("shipping address", shippingAddress);

  return (
    <div>
      <div className="rounded-lg border-2 border-gray-800 bg-slate-500">
        <h2 className="text-lg font-bold">Your Shipping Address</h2>
      </div>
      <Link href="/checkout/payment">Payment</Link>
    </div>
  );
}
