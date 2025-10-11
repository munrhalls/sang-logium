import Modal from "@/app/components/ui/modal/Modal";
import AccountDrawer from "@/app/components/features/account-drawer/AccountDrawer";
import { CreditCard, LogOut, MapPin, Package, Settings } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <AccountDrawer>{children}</AccountDrawer> */}
      <div className="grid h-full grid-cols-12">
        <div className="col-span-4 flex h-full flex-col justify-around space-y-6 border border-r-2 border-black p-6 align-middle">
          <Link
            href="/orders"
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
          <button className="mx-auto flex w-8 flex-col items-center rounded-lg bg-slate-800 py-2 font-medium text-white transition-colors hover:bg-gray-800 sm:w-auto sm:p-4">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
        <main className="col-span-8 overflow-y-auto bg-slate-700 p-6 text-black">
          {children}
        </main>
      </div>
    </>
  );
}
