import Link from "next/link";
export default function page() {
  return (
    <div>
      Confirmation
      <Link href="/checkout/payment">Payment</Link>
    </div>
  );
}
