"use client";
import { useBasketStore } from "@/store/store";
import EmptyBasketContent from "./EmptyBasketContent";
import Basket from "./Basket";
import BasketSummary from "./BasketSummary";

export default function BasketClientWrapper() {
  const basket = useBasketStore((s) => s.basket);

  if (basket?.length === 0) {
    return <EmptyBasketContent />;
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="overflow-hidden rounded-sm bg-white shadow-sm">
          <Basket />
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-4 rounded-sm bg-white p-6 shadow-sm">
          <BasketSummary />
        </div>
      </div>
    </div>
  );
}
