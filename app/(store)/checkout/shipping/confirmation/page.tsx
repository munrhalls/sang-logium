"use client";
import Link from "next/link";
import { useCheckout } from "@/app/(store)/checkout/layout";
import { redirect } from "next/navigation";

export default function Page() {
  const { shippingAPIValidation, shippingAddress } = useCheckout();
  // IF the value === 'CONFIRMED', just show payment button / link to payment page, still show small update button though, which takes the user back to shipping page but with prefilled data
  // IF the value === 'PARTIAL' - everything is the same except warning message is shown that the address was only partially confirmed by the maps - gentle notice to user if they're sure to proceed and aware that responsibility for wrong address is on them
  // commit

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
