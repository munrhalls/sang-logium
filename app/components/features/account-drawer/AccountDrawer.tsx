"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, MapPin, CreditCard, Settings, LogOut } from "lucide-react";

export default function AccountDrawer() {
  const router = useRouter();

  return (
    <>
      <div className="fixed inset-0 z-40 md:bg-black/50" />

      <div className="fixed bottom-14 right-0 top-[4rem] z-50 w-full overflow-y-scroll bg-white shadow-lg sm:w-11/12 sm:max-w-3xl xl:max-w-6xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-black p-2">
            <h2 className="w-full text-center text-xl font-bold text-gray-900">
              Account
            </h2>
            <button
              onClick={() => router.back()}
              className="rounded-sm p-2 transition-colors hover:bg-gray-100"
            >
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between border-b border-black p-6"></div>

          <div className="grid h-full grid-cols-12">
            <div className="col-span-4 flex h-full flex-col justify-around space-y-6 border border-r-2 border-black p-6 align-middle">
              <Link
                href="/account/orders"
                className="flex flex-col items-center gap-2 rounded-sm text-center font-black transition-colors hover:bg-gray-100"
              >
                <Package className="h-6 w-6 text-gray-600" />
                <span className="hidden sm:inline">Orders</span>
              </Link>
              <Link
                href="/account/addresses"
                className="flex flex-col items-center gap-2 rounded-sm text-center font-black transition-colors hover:bg-gray-100"
              >
                <MapPin className="h-6 w-6 text-gray-600" />
                <span className="hidden sm:inline">Addresses</span>
              </Link>
              <Link
                href="/account/payment-methods"
                className="flex flex-col items-center gap-2 rounded-sm text-center font-black transition-colors hover:bg-gray-100"
              >
                <CreditCard className="h-6 w-6 text-gray-600" />
                <span className="hidden sm:inline">Payment</span>
              </Link>
              <Link
                href="/account/settings"
                className="flex flex-col items-center gap-2 rounded-sm text-center font-black transition-colors hover:bg-gray-100"
              >
                <Settings className="h-6 w-6 text-gray-600" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
              <button className="mx-auto flex w-8 flex-col items-center rounded-sm bg-slate-700 py-2 font-medium text-white transition-colors hover:bg-gray-800">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
