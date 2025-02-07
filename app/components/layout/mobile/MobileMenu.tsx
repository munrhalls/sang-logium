"use client";
import React from "react";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useStore, UIState } from "@/store";

const MobileMenu = () => {
  const isCategoriesOpen = useStore((state) => state.isCategoriesDrawerOpen);
  const toggleCategoriesDrawer = useStore(
    (state) => state.toggleCategoriesDrawer
  );

  return (
    <div className=" bg-black text-white border-t border-white lg:hidden">
      <div className="h-16 flex justify-around items-center px-4">
        <button
          className="flex flex-col items-center"
          onClick={toggleCategoriesDrawer}
        >
          <Menu className="h-6 w-6" />
          {isCategoriesOpen ? (
            <span className="text-xs mt-1">X</span>
          ) : (
            <span className="text-xs mt-1">Menu</span>
          )}
        </button>

        <button className="flex flex-col items-center">
          <Search className="h-6 w-6" />
          <span className="text-xs mt-1">Search</span>
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
  );
};

export default MobileMenu;
