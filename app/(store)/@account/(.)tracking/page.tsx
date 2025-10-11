"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, MapPin, CreditCard, Settings, LogOut } from "lucide-react";

export default function Tracking() {
  const router = useRouter();

  const previousUrl = sessionStorage.getItem("pre_modal_url") || "/";

  const handleExit = () => {
    router.replace(previousUrl, { scroll: false });
    sessionStorage.removeItem("pre_modal_url");
  };

  return (
    <>
      <div
        onClick={handleExit}
        className="fixed inset-0 bottom-14 top-[4rem] z-40 sm:bottom-0 sm:top-[6rem] md:bg-black/50"
      />
      <div className="fixed bottom-14 right-0 top-[4rem] z-50 w-full overflow-y-scroll bg-white shadow-lg sm:bottom-0 sm:top-[6rem] sm:w-11/12 sm:max-w-3xl xl:max-w-6xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-black p-2">
            <h2 className="w-full text-center text-xl font-bold text-gray-900">
              Tracking
            </h2>

            <button
              onClick={handleExit}
              className="mx-auto flex w-8 flex-col items-center rounded-lg bg-black py-2 font-medium text-white transition-colors hover:bg-gray-800 sm:w-10 sm:py-3"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <div>input - </div>
          <div>Your recent orders</div>
          <div></div>
        </div>
      </div>
    </>
  );
}
