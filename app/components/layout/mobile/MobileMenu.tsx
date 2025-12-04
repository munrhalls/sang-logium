"use client";

import React from "react";
import { Menu, Search, ShoppingBag, X, Truck } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { DrawerToggleLink } from "./DrawerToggleLink";

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

  const isSearchOpen =
    searchParams.get("search") === "true" &&
    searchParams.get("menu") !== "true";
  const isMenuOpen =
    searchParams.get("menu") === "true" &&
    searchParams.get("search") !== "true";

  return (
    <div className="h-14 border-t border-white bg-black py-2 text-white lg:hidden">
      <div className="flex items-center justify-around px-4">
        <DrawerToggleLink
          isOpen={isMenuOpen}
          param="menu"
          openIcon={
            <>
              <Menu className="h-6 w-6" />
              <span className="mt-1 hidden text-xs sm:inline-block">Menu</span>
            </>
          }
          closeIcon={<X size={24} />}
          label="Menu"
        />
        <DrawerToggleLink
          isOpen={isSearchOpen}
          param="search"
          openIcon={
            <>
              <Search className="h-6 w-6" />
              <span className="mt-1 hidden text-xs sm:inline-block">
                Search
              </span>
            </>
          }
          closeIcon={<X size={24} />}
          label="Search"
        />
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
