"use client";
import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useBasketStore } from "@/store/store";
import BasketControls from "@/app/components/features/basket/BasketControls";

export default function Basket() {
  const basket = useBasketStore((s) => s.basket);

  return (
    <div>
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
                <span className="font-medium">${item.price.toFixed(2)}</span> ×{" "}
                {item.quantity}
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
  );
}
