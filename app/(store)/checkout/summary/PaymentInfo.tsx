import Link from "next/link";
import { usePaymentStore } from "@/store/checkout";
const { paymentInfo } = usePaymentStore.getState();

export default function PaymentInfo() {
  return (
    <div className="rounded-lg border border-black p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Payment Information</h3>
        <Link
          href="/checkout/payment"
          className="text-sm text-blue-600 hover:underline"
          aria-label="Edit payment information"
        >
          Edit
        </Link>
      </div>
      {paymentInfo ? (
        <div className="space-y-1 text-sm text-gray-700">
          <p>{paymentInfo.cardholderName}</p>
          <p>**** **** **** {paymentInfo.last4}</p>
        </div>
      ) : (
        <p className="text-sm text-red-600">Payment information missing</p>
      )}
    </div>
  );
}
