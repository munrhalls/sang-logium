"use client";
import Link from "next/link";
import { useCheckout } from "@/app/(store)/checkout/layout";
import { redirect } from "next/navigation";
import DisplayAddress from "./DisplayAddress";

export default function Page() {
  const { shippingAPIValidation, shippingAddress } = useCheckout();

  if (shippingAPIValidation?.status == null || shippingAddress == null) {
    redirect("/checkout/shipping");
  }

  console.log("shipping address", shippingAddress);

  return (
    <div>
      <DisplayAddress shippingAddress={shippingAddress} />

      {/* <Link href="/checkout/payment">Payment</Link> */}
    </div>
  );
}
