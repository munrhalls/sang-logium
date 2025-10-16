"use client";
import { ShoppingCartIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import SegmentTitle from "@/app/components/ui/segment-title/SegmentTitle";
import { useBasketStore } from "@/store/store";
import BasketControls from "@/app/components/features/basket/BasketControls";
import Empty from "./Empty";

export default function BasketPage() {
  const basket = useBasketStore((s) => s.basket);
  const getTotal = useBasketStore((s) => s.getTotal);
  const shipping = 15.99;
  const subtotal = getTotal();
  const total = subtotal + shipping;

  if (basket.length === 0) {
    return <Empty />;
  }
  return (
    <div className="mx-auto my-8 max-w-7xl bg-slate-100 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <SegmentTitle title="Your Basket" />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-sm bg-white shadow-sm">
            <div className="hidden grid-cols-[3fr_1fr_1fr_auto] border-b border-gray-200 bg-gray-50 p-5 text-sm font-semibold text-gray-700 lg:grid">
              <div>Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div></div>
            </div>
            {basket.map((item) => (
              <div
                key={item._id + "Basket page"}
                className="grid grid-cols-1 items-center gap-5 border-b border-gray-200 p-5 transition-colors hover:bg-gray-50 lg:grid-cols-[3fr_1fr_1fr_auto]"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-sm bg-gray-100">
                    <ShoppingCartIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <div>
                    <Link href={`/product/${item._id}`}>
                      <h3 className="text-lg font-medium text-gray-900 hover:underline">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="mt-2 text-sm text-gray-500 lg:hidden">
                      <span className="font-medium">
                        ${item.price.toFixed(2)}
                      </span>{" "}
                      × {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="hidden items-center justify-center lg:flex">
                  <div className="font-medium text-gray-900">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center lg:justify-center">
                  <div className="mr-3 text-sm font-medium text-gray-600 lg:hidden">
                    Quantity:
                  </div>
                  <div className="flex items-center">
                    <BasketControls product={item} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 lg:hidden">
            <Link
              href="/products"
              className="flex w-full items-center justify-center gap-2 rounded-sm border border-gray-300 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-sm bg-white p-6 shadow-sm">
            <h2 className="mb-6 border-b border-gray-200 pb-4 text-lg font-bold">
              Order Summary
            </h2>
            <div className="mb-6 space-y-4">
              <div className="flex justify-between text-gray-700">
                <div>
                  Subtotal (
                  {basket.reduce((sum, item) => sum + item.quantity, 0)} items)
                </div>
                <div className="font-medium">${subtotal.toFixed(2)}</div>
              </div>
              <div className="flex justify-between text-gray-700">
                <div>Shipping</div>
                <div className="font-medium">${shipping.toFixed(2)}</div>
              </div>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <div>Total</div>
                  <div>${total.toFixed(2)}</div>
                </div>
                <div className="mt-1 text-xs text-gray-500">Including VAT</div>
              </div>
            </div>
            <Link
              href="/checkout"
              className="flex w-full items-center justify-center rounded-sm bg-black py-4 text-lg font-medium text-white transition-colors hover:bg-gray-800"
            >
              Proceed to Checkout
            </Link>
            <div className="mt-4 hidden lg:block">
              <Link
                href="/products"
                className="flex w-full items-center justify-center gap-2 rounded-sm border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Continue Shopping
              </Link>
            </div>
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex flex-col gap-2 text-xs text-gray-500">
                <p className="font-medium text-gray-700">We Accept:</p>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-10 rounded bg-gray-200"></div>
                  <div className="h-6 w-10 rounded bg-gray-200"></div>
                  <div className="h-6 w-10 rounded bg-gray-200"></div>
                  <div className="h-6 w-10 rounded bg-gray-200"></div>
                </div>
                <p className="mt-2">Secure checkout powered by Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
