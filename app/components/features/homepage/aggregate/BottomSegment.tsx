import { Suspense } from "react";
import MonthProductSkeleton from "../product-showcase/month-product/MonthProductSkeleton";
import MonthProduct from "../product-showcase/month-product/MonthProduct";

export default function BottomSegment() {
  return (
    <div className="mx-auto grid grid-cols-[auto_8fr_auto] xl:grid-cols-[1fr_8fr_1fr]">
      <div className="col-start-1 col-end-4">
        <Suspense fallback={<MonthProductSkeleton />}>
          <MonthProduct />
        </Suspense>
      </div>
    </div>
  );
}
