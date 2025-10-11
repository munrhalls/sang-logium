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
        Tracking
      </div>
    </>
  );
}
