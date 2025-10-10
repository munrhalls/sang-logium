import Link from "next/link";

export default function Payment() {
  return (
    <div>
      Payment
      <Link href="/checkout/summary" className="p-3 border border-black">
        Continue
      </Link>
    </div>
  );
}
