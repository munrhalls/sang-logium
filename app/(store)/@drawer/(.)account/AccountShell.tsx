import { Package, MapPin, CreditCard } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import BackdropClose from "@/app/components/features/account/BackdropClose";
import ExitButton from "@/app/components/features/account/ExitButton";

export default function AccountShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BackdropClose />
      <div className="fixed bottom-14 right-0 top-[4rem] z-50 w-full overflow-y-scroll bg-white shadow-lg sm:bottom-0 sm:top-[6rem] sm:w-11/12 sm:max-w-3xl xl:max-w-6xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-black p-2">
            <h2 className="w-full text-center text-xl font-bold text-gray-900">
              Account
            </h2>
            <ExitButton />
          </div>
          <div className="grid h-full grid-cols-12">
            <div className="col-span-2 flex h-full flex-col justify-around space-y-6 border border-r-2 border-black py-3 align-middle sm:col-span-4 sm:p-6">
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
                href="/account/payments"
                className="flex flex-col items-center gap-2 rounded-sm text-center font-black transition-colors hover:bg-gray-100"
              >
                <CreditCard className="h-6 w-6 text-gray-600" />
                <span className="hidden sm:inline">Payments</span>
              </Link>
              <div className="flex flex-col items-center gap-2 rounded-sm text-center font-black transition-colors hover:bg-gray-100">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: {
                        width: "2rem",
                        height: "2rem",
                        "@media (min-width: 768px)": {
                          width: "3.5rem",
                          height: "3.5rem",
                        },
                      },
                      userButtonPopoverCard: {
                        right: 0,
                        left: "unset",
                      },
                    },
                  }}
                />
              </div>
            </div>
            <main className="col-span-8 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </div>
    </>
  );
}
