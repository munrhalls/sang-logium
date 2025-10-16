"use client";
import SegmentTitle from "@/app/components/ui/segment-title/SegmentTitle";
import Empty from "./Empty";
import Basket from "./Basket";
import BasketSummary from "./BasketSummary";
import { useBasketStore } from "@/store/store";

export default function BasketPage() {
  const basket = useBasketStore((s) => s.basket);

  if (basket?.length === 0) {
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
            <Basket />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-sm bg-white p-6 shadow-sm">
            <BasketSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
