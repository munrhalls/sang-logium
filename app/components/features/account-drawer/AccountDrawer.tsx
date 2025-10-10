"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountDrawer() {
  const router = useRouter();

  return (
    <>
      <div className="fixed inset-0 z-40 md:bg-black/50" />

      <div className="fixed bottom-0 right-0 top-[4rem] z-50 w-full bg-white shadow-lg sm:w-11/12 sm:max-w-3xl xl:max-w-6xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-black p-6">
            <h2 className="text-xl font-bold text-gray-900">Account</h2>
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

          <div className="grid h-full grid-cols-12">
            <div className="col-span-4 flex h-full flex-col justify-around border border-r-2 border-black align-middle">
              <Link
                href="/account/orders"
                className="rounded-sm text-center font-black"
              >
                Orders
              </Link>
              <Link
                href="/account/addresses"
                className="rounded-sm text-center font-black"
              >
                Addresses
              </Link>

              <Link
                href="/account/payment-methods"
                className="whitespace-pre-wrap rounded-sm text-center font-black"
              >
                Payment
              </Link>

              <Link
                href="/account/settings"
                className="rounded-sm text-center font-black"
              >
                Settings
              </Link>
              <button className="mx-auto w-[90%] rounded-sm bg-black py-3 font-medium text-white transition-colors hover:bg-gray-800">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
