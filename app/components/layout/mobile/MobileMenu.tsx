"use client";

import React from "react";
import { Menu, Search, ShoppingBag, X, Truck } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useQueryState } from "nuqs";
import { usePathname, useSearchParams } from "next/navigation";

const Authentication = dynamic(
  () => import("@/app/components/features/auth/Authentication"),
  {
    loading: () => (
      <div className="flex text-white">
        <div className="mx-auto h-[24px] w-[24px] animate-pulse rounded-full bg-blue-700" />
        <span className="pl-2">Loading...</span>
      </div>
    ),
    ssr: false,
  }
);

function MobileMenuInner() {
  // TODO figure how to use NUQS to properly manage query state of both search/menu, given that they are mutually exclusive

  const pathname = usePathname();

  return (
    <div className="h-14 border-t border-white bg-black py-2 text-white lg:hidden">
      <div className="flex items-center justify-around px-4">
        {/* {isMenuOpen ? (
          <Link href={pathname} className="flex flex-col items-center">
            <X size={24} />
          </Link>
        ) : (
          <Link
            href={`${pathname}?menu=true`}
            className="flex flex-col items-center"
          >
            <Menu className="h-6 w-6" />
            <span className="mt-1 hidden text-xs sm:inline-block">Menu</span>
          </Link>
        )} */}
        <Link
          href={`${pathname}?menu=true`}
          className="flex flex-col items-center"
        >
          <Menu className="h-6 w-6" />
          <span className="mt-1 hidden text-xs sm:inline-block">Menu</span>
        </Link>

        <Link
          href={`${pathname}?search=true`}
          className="flex flex-col items-center"
        >
          <Search className="h-6 w-6" />
          <span className="mt-1 hidden text-xs sm:inline-block">Search</span>
        </Link>

        <Authentication />
        <Link href="/tracking" className="flex flex-col items-center">
          <Truck className="h-6 w-6" />
          <span className="mt-1 hidden text-xs sm:inline-block">Track</span>
        </Link>
        <Link href="/basket" className="flex flex-col items-center">
          <ShoppingBag className="h-6 w-6" />
          <span className="mt-1 hidden text-xs sm:inline-block">Basket</span>
        </Link>
      </div>
    </div>
  );
}

export default function MobileMenu() {
  const [isMenu, setIsMenu] = useQueryState("menu", {
    defaultValue: false,
    history: "push",
  });
  const searchParams = useSearchParams();

  return (
    <React.Suspense
      fallback={
        <div className="h-14 border-t border-white bg-black py-2 text-white lg:hidden" />
      }
    >
      <MobileMenuInner />
    </React.Suspense>
  );
}
