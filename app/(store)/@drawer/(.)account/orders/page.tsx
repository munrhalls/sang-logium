import Link from "next/link";
export default function Orders() {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-black p-6">
        <div>filter</div>
        <div>sort</div>
        <div>search</div>
      </div>
      <div>
        orders motherfucker
        <div>
          <Link href="/account/orders/order-details/1">Order Details</Link>
        </div>
      </div>
    </div>
  );
}
