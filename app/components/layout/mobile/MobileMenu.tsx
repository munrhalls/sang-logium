"use client";

import React from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useStore } from "@/store";
import { ClerkLoaded } from "@clerk/nextjs";
import Link from "next/link";
import dynamic from "next/dynamic";

const AuthContent = dynamic(
  () => import("@/app/components/features/auth/AuthContent"),
  {
    loading: () => (
      <div className="w-[16px] h-[16px] mx-auto bg-gray-800 rounded-full animate-pulse" />
    ),
    ssr: false,
  }
);

const MobileMenu = () => {
  const isCategoriesOpen = useStore((state) => state.isCategoriesDrawerOpen);
  const toggleCategoriesDrawer = useStore(
    (state) => state.toggleCategoriesDrawer
  );
  const isSearchDrawerOpen = useStore((state) => state.isSearchDrawerOpen);
  const toggleSearchDrawer = useStore((state) => state.toggleSearchDrawer);

  return (
    <>
      <div className="h-14 py-2 bg-black text-white border-t border-white lg:hidden">
        <div className="flex justify-around items-center px-4">
          <button
            className="flex flex-col items-center"
            onClick={toggleCategoriesDrawer}
          >
            {isCategoriesOpen ? (
              <X size={24} />
            ) : (
              <>
                <Menu className="h-6 w-6" />
                <span className="text-xs mt-1">Menu</span>
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
                <span className="text-xs mt-1">Search</span>
              </>
            )}
          </button>

          <Link href="/basket" className="flex flex-col items-center">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xs mt-1">Basket</span>
          </Link>

          <ClerkLoaded>
            <AuthContent />
          </ClerkLoaded>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
