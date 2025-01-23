import React from "react";
import { Menu, Search, ShoppingBag, User } from "lucide-react";

const MobileFooter = () => {
  return (
    <div className=" bg-black text-white border-t border-white lg:hidden">
      <div className="h-16 flex justify-around items-center px-4">
        <button className="flex flex-col items-center">
          <Menu className="h-6 w-6" />
          <span className="text-xs mt-1">Categories</span>
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

export default MobileFooter;
