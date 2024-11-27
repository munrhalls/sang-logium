"use client";

import { FaBars, FaSearch, FaShoppingBag, FaUser } from "react-icons/fa";
import { useToggleDrawer } from "../store";

export default function MobileFooter() {
  const toggleDrawer = useToggleDrawer();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white flex justify-around items-center h-16 lg:hidden">
      <button className="flex flex-col items-center">
        <FaBars size={24} />
        <span className="text-xs mt-1">Categories</span>
      </button>
      <button className="flex flex-col items-center" onClick={toggleDrawer}>
        <FaSearch size={24} />
        <span className="text-xs mt-1">Search</span>
      </button>
      <button className="flex flex-col items-center">
        <FaShoppingBag size={24} />
        <span className="text-xs mt-1">Basket</span>
      </button>
      <button className="flex flex-col items-center">
        <FaUser size={24} />
        <span className="text-xs mt-1">Account</span>
      </button>
    </div>
  );
}
