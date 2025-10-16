"use client";
import Link from "next/link";
import { useCheckoutStore } from "@/store/checkout";
const { shippingInfo } = useCheckoutStore.getState();

export default function ShippingInfo() {
  return (
    <div className="rounded-lg border border-black p-3">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Shipping Information</h3>
        <Link
          href="/checkout/shipping"
          className="text-sm text-blue-600 hover:underline"
          aria-label="Edit shipping information"
        >
          Edit
        </Link>
      </div>
      {shippingInfo ? (
        <div className="space-y-1 text-sm text-gray-700">
          <p>{shippingInfo.name}</p>
          <p>{shippingInfo.email}</p>
          <p>{shippingInfo.address}</p>
          <p>
            {shippingInfo.city}, {shippingInfo.postalCode}
          </p>
          <p>{shippingInfo.country}</p>
        </div>
      ) : (
        <p className="text-sm text-red-600">Shipping information missing</p>
      )}
    </div>
  );
}
