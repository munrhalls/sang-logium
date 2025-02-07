"use client";

import React from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useStore } from "@/store";

const MobileMenu = () => {
  const isCategoriesOpen = useStore((state) => state.isCategoriesDrawerOpen);
  const toggleCategoriesDrawer = useStore(
    (state) => state.toggleCategoriesDrawer
  );
  const isSearchDrawerOpen = useStore((state) => state.isSearchDrawerOpen);
  const toggleSearchDrawer = useStore((state) => state.toggleSearchDrawer);

  return (
    <>
      <div className=" bg-black text-white border-t border-white lg:hidden">
        <div className="h-16 flex justify-around items-center px-4">
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

          <button className="flex flex-col items-center">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xs mt-1">Basket</span>
          </button>

          <button className="flex flex-col items-center">
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Sign in</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
