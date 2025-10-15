import Link from "next/link";

export default function Payment() {
  return (
    <div>
      Payment
      <Link href="/checkout/summary" className="border border-black p-3">
        Continue
      </Link>
    </div>
  );
}
