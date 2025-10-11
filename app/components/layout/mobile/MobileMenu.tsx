"use client";
import React from "react";
import { Menu, Search, ShoppingBag, X, Truck } from "lucide-react";
import { useUIStore } from "@/store";
import Link from "next/link";
import dynamic from "next/dynamic";

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

const MobileMenu = () => {
  const isCategoriesOpen = useUIStore((state) => state.isCategoriesDrawerOpen);
  const toggleCategoriesDrawer = useUIStore(
    (state) => state.toggleCategoriesDrawer
  );
  const isSearchDrawerOpen = useUIStore((state) => state.isSearchDrawerOpen);
  const toggleSearchDrawer = useUIStore((state) => state.toggleSearchDrawer);
  return (
    <>
      <div className="h-14 border-t border-white bg-black py-2 text-white lg:hidden">
        <div className="flex items-center justify-around px-4">
          <button
            className="flex flex-col items-center"
            onClick={toggleCategoriesDrawer}
          >
            {isCategoriesOpen ? (
              <X size={24} />
            ) : (
              <>
                <Menu className="h-6 w-6" />

                <span className="mt-1 hidden text-xs sm:inline-block">
                  Menu
                </span>
              </>
            )}
          </button>
          <button
            className="flex flex-col items-center"
            onClick={toggleSearchDrawer}
          >
            {isSearchDrawerOpen ? (
              <X size={24} />
            ) : (
              <>
                <Search className="h-6 w-6" />
                <span className="mt-1 hidden text-xs sm:inline-block">
                  Search
                </span>
              </>
            )}
          </button>
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
    </>
  );
};
export default MobileMenu;
