"use client";

import {
  ShoppingCartIcon,
  XMarkIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import SegmentTitle from "@/app/components/ui/segment-title/SegmentTitle";
import { useBasketStore } from "@/store";
import BasketControls from "@/app/components/features/basket/BasketControls";

export default function BasketPage() {
  const basket = useBasketStore((s) => s.basket);
  const updateQuantity = useBasketStore((s) => s.updateQuantity);
  const removeItem = useBasketStore((s) => s.removeItem);
  const getTotal = useBasketStore((s) => s.getTotal);
  const isCheckoutEnabled = useBasketStore((s) => s.isCheckoutEnabled);

  const shipping = 15.99;
  const subtotal = getTotal();
  const total = subtotal + shipping;

  if (basket.length === 0) {
    return (
      <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 bg-slate-100 pt-8 pb-16">
        <div className="mb-8">
          <SegmentTitle title="Your Basket" />
        </div>
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-sm shadow-sm">
          <ShoppingCartIcon className="h-20 w-20 text-gray-400 mb-6" />
          <h2 className="text-2xl font-medium text-gray-800">
            Your basket is empty
          </h2>
          <p className="text-gray-600 mt-3 mb-8 text-center max-w-md">
            Looks like you haven&apos;t added any products to your basket yet.
            Browse our collection to find something you&apos;ll love.
          </p>
          <Link
            href="/products"
            className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-sm hover:bg-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 bg-slate-100 pt-8 pb-16">
      <div className="mb-8">
        <SegmentTitle title="Your Basket" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-sm shadow-sm overflow-hidden">
            <div className="hidden lg:grid grid-cols-[3fr_1fr_1fr_auto] p-5 border-b border-gray-200 text-sm font-semibold text-gray-700 bg-gray-50">
              <div>Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div></div>
            </div>

            {basket.map((item) => (
              <div
                key={item._id + "Basket page"}
                className="grid grid-cols-1 lg:grid-cols-[3fr_1fr_1fr_auto] p-5 border-b border-gray-200 gap-5 items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-5">
                  <div className="w-24 h-24 bg-gray-100 rounded-sm flex items-center justify-center overflow-hidden">
                    <ShoppingCartIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <div>
                    <Link href={`/product/${item._id}`}>
                      <h3 className="font-medium text-lg text-gray-900 hover:underline">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 lg:hidden mt-2">
                      <span className="font-medium">
                        ${item.price.toFixed(2)}
                      </span>{" "}
                      × {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="hidden lg:flex items-center justify-center">
                  <div className="font-medium text-gray-900">
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center lg:justify-center">
                  <div className="lg:hidden text-sm font-medium text-gray-600 mr-3">
                    Quantity:
                  </div>
                  <div className="flex items-center">
                    <BasketControls product={item} />
                  </div>
                </div>

                <div className="hidden lg:flex items-center justify-center">
                  <button
                    onClick={() => removeItem(item._id)}
                    className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 lg:hidden">
            <Link
              href="/products"
              className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 font-medium"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-sm shadow-sm p-6 sticky top-4">
            <h2 className="text-lg font-bold mb-6 pb-4 border-b border-gray-200">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
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
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between font-bold text-xl">
                  <div>Total</div>
                  <div>${total.toFixed(2)}</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Including VAT</div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 bg-black text-white rounded-sm hover:bg-gray-800 transition-colors font-medium text-lg flex items-center justify-center"
            >
              Proceed to Checkout
            </Link>

            <div className="mt-4 hidden lg:block">
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 w-full py-3 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition-colors font-medium"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Continue Shopping
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-xs text-gray-500 flex flex-col gap-2">
                <p className="font-medium text-gray-700">We Accept:</p>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
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
