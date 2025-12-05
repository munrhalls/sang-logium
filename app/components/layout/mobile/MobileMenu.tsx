"use client";

import React from "react";
import { Menu, Search, ShoppingBag, X, Truck } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSearchParams, usePathname } from "next/navigation";

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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isSearchOpen =
    searchParams.get("search") === "true" &&
    searchParams.get("menu") !== "true";
  const isMenuOpen =
    searchParams.get("menu") === "true" &&
    searchParams.get("search") !== "true";

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

        {isSearchOpen ? (
          <Link href={pathname} className="flex flex-col items-center">
            <X size={24} />
          </Link>
        ) : (
          <Link
            href={`${pathname}?search=true`}
            className="flex flex-col items-center"
          >
            <Search className="h-6 w-6" />
            <span className="mt-1 hidden text-xs sm:inline-block">Search</span>
          </Link>
        )}

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
