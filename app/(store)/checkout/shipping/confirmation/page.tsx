import Link from "next/link";
import ShippingConfirmation from "@/app/components/features/checkout/ShippingConfirmation";

export default function page() {
  return (
    <div>
      <ShippingConfirmation />
      <Link href="/checkout/payment">Payment</Link>
    </div>
  );
}
