import { ArrowLeftIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import SegmentTitle from "@/app/components/ui/segment-title/SegmentTitle";
export default function Empty() {
  return (
    <div className="mx-auto my-8 max-w-7xl bg-slate-100 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <SegmentTitle title="Your Basket" />
      </div>
      <div className="flex flex-col items-center justify-center rounded-sm bg-white p-12 shadow-sm">
        <ShoppingCartIcon className="mb-6 h-20 w-20 text-gray-400" />
        <h2 className="text-2xl font-medium text-gray-800">
          Your basket is empty
        </h2>
        <p className="mb-8 mt-3 max-w-md text-center text-gray-600">
          Looks like you haven&apos;t added any products to your basket yet.
          Browse our collection to find something you&apos;ll love.
        </p>
        <Link
          href="/products"
          className="flex items-center gap-2 rounded-sm bg-black px-8 py-3 text-white transition-colors hover:bg-gray-800"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Browse Products
        </Link>
      </div>
    </div>
  );
}
