import Link from "next/link";
import { useCheckout } from "@/app/(store)/checkout/layout";

export default function Page() {
  const { shippingAPIValidation } = useCheckout();
  return (
    <div>
      <div className="bg-slate-600">
        <h2 className="text-lg font-bold">
          Shipping Address CONFIRMATION STATUS
        </h2>
        <p className="text-white">
          Status: {shippingAPIValidation?.status || "Loading..."}
        </p>
      </div>
      <Link href="/checkout/payment">Payment</Link>
    </div>
  );
}
