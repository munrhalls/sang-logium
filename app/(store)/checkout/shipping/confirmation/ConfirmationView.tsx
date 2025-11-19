"use client";
import Link from "next/link";
import { useCheckout } from "@/app/(store)/checkout/layout";
import DisplayAddress from "./DisplayAddress";
import { Check, Edit3 } from "lucide-react";
import { ShippingAddress } from "@/app/(store)/checkout/layout";

// TODO earlier, need to create guest account that'll live inside cookie / session
// TODO upon "proceed to payment" click, the address needs to be safely saved to cookie and sealed via JWT
// TODO then that info needs ot somehow end up in the payment page
// TODO if this is guest account, checkout session consumes their address information from cookie/JWT
// TODO otherwise, if logged in, it uses their saved address info from their clerk user acc

export default function ConfirmationView({
  shippingAddress,
}: {
  shippingAddress: ShippingAddress;
}) {
  const { addressApiValidation, setIsAddressValidated } = useCheckout();

  if (addressApiValidation == null || shippingAddress == null) {
    setIsAddressValidated(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-md">
        <DisplayAddress shippingAddress={shippingAddress} />
        <button
          onClick={() => setIsAddressValidated(false)}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-yellow-900 hover:text-yellow-950"
        >
          <Edit3 size={16} />
          Edit
        </button>
      </div>

      {addressApiValidation === "CONFIRMED" ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
          <Check className="text-green-600" size={18} />
          <p className="text-sm font-semibold text-green-800">
            Address confirmed on map
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-yellow-300 bg-yellow-50 p-3">
          <p className="text-sm text-yellow-800">
            Address partially confirmed on the map. Are you sure it&apos;s
            correct?{" "}
          </p>
        </div>
      )}

      <Link
        href="/checkout/payment"
        className="rounded-lg bg-indigo-600 px-6 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-indigo-700"
      >
        Proceed to Payment
      </Link>
    </div>
  );
}
