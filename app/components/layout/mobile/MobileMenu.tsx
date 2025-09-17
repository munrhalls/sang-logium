"use client";
import React from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useUIStore } from "@/store";
import Link from "next/link";
import Authentication from "../../features/auth/Authentication";

const MobileMenu = () => {
  const isCategoriesOpen = useUIStore((state) => state.isCategoriesDrawerOpen);
  const toggleCategoriesDrawer = useUIStore(
    (state) => state.toggleCategoriesDrawer
  );
  const isSearchDrawerOpen = useUIStore((state) => state.isSearchDrawerOpen);
  const toggleSearchDrawer = useUIStore((state) => state.toggleSearchDrawer);
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
          <Authentication />
        </div>
      </div>
    </>
  );
};
export default MobileMenu;
