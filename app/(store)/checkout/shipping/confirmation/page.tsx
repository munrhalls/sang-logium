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
  const status = "CONFIRMED";

  return (
    <div className="flex flex-col gap-6">
      {/* Address Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <DisplayAddress shippingAddress={shippingAddress} />
        <Link
          href="/checkout/shipping"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-700 transition hover:text-gray-900"
        >
          <Edit3 size={18} />
          Edit Address
        </Link>
      </div>

      {status === "CONFIRMED" ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-4">
          <Check className="text-green-600" size={20} />
          <p className="font-semibold text-green-800">
            Address confirmed on map
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            Address partially confirmed on map. Are you sure you want to use
            this address for shipping?
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-6">
        <Link
          href="/checkout/payment"
          className="rounded-lg bg-indigo-600 px-6 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Proceed to Payment
        </Link>
      </div>
    </div>
  );
}
