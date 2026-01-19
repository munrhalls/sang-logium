import SegmentTitle from "@/app/components/ui/segment-title/SegmentTitle";
import BasketClientWrapper from "./BasketClientWrapper";
import { Suspense } from "react";
import Loader from "@/app/components/common/Loader";

export default function BasketPage() {
  return (
    <div className="mx-auto my-8 max-w-7xl bg-slate-100 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <SegmentTitle title="Your Basket" />
      </div>
      <Suspense fallback={<Loader />}>
        <BasketClientWrapper />
      </Suspense>
    </div>
  );
}
