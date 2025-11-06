"use client";
import Link from "next/link";
import { useCheckout } from "@/app/(store)/checkout/layout";
import { redirect } from "next/navigation";

export default function Page() {
  const { shippingAPIValidation } = useCheckout();
  // IF the value === 'CONFIRMED', just show payment button / link to payment page, still show small update button though, which takes the user back to shipping page but with prefilled data
  // IF the value === 'PARTIAL' - everything is the same except warning message is shown that the address was only partially confirmed by the maps - gentle notice to user if they're sure to proceed and aware that responsibility for wrong address is on them
  // commit

  if (!shippingAPIValidation?.status) {
    redirect("/checkout/shipping");
  }

  return (
    <div>
      <div className="bg-slate-600">
        <h2 className="text-lg font-bold">
          Shipping Address CONFIRMATION STATUS
        </h2>
        <p className="text-white">
          Status: {shippingAPIValidation.status || "Loading..."}
        </p>
      </div>
      <Link href="/checkout/payment">Payment</Link>
    </div>
  );
}
