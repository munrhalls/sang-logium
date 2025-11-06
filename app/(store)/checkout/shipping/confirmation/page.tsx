"use client";
import Link from "next/link";
import { useCheckout } from "@/app/(store)/checkout/layout";
import { redirect } from "next/navigation";
import DisplayAddress from "./DisplayAddress";
import { Check, X, Edit3 } from "lucide-react";

export default function Page() {
  const { shippingAPIValidation, shippingAddress } = useCheckout();
  if (shippingAPIValidation?.status == null || shippingAddress == null) {
    redirect("/checkout/shipping");
  }

  console.log("shipping address", shippingAddress);

  // const status = shippingAPIValidation.status;
  const status = "PARTIAL";

  return (
    <div className="flex flex-col gap-4">
      <DisplayAddress shippingAddress={shippingAddress} />
      {status === "CONFIRMED" ? (
        <>
          <div className="flex items-center gap-2">
            <p className="font-black">Address confirmed on map</p>
            <Check className="text-green-500" size={24} />
          </div>
          <Link href="/checkout/payment">Proceed to payment</Link>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <p>
              Address partially confirmed on map. Are you sure you want to use
              this address for shipping?
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/checkout/shipping">Edit address</Link>
            <Edit3 className="text-blue-500" size={24} />
          </div>
          <Link href="/checkout/payment">Proceed to payment</Link>
        </>
      )}
    </div>
  );
}
