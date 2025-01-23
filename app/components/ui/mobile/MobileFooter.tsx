"use client";

import { FaBars, FaSearch, FaShoppingBag } from "react-icons/fa";
import { useStore } from "../../../../store";
import { ClerkLoaded } from "@clerk/nextjs";
// import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { UIState } from "../../../../store";
import AuthContent from "@/app/components/features/auth/AuthContent";

export default function MobileFooter() {
  // const { user } = useUser();

  // const createClerkPasskey = async () => {
  //   try {
  //     const response = await user?.createPasskey();
  //     console.log(response);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const toggleCategoriesDrawer = useStore(
    (state: UIState) => state.toggleCategoriesDrawer
  );

  const isCategoriesDrawerOpen = useStore(
    (state: UIState) => state.isCategoriesDrawerOpen
  );

  const toggleSearchDrawer = useStore(
    (state: UIState) => state.toggleSearchDrawer
  );

  const isSearchDrawerOpen = useStore(
    (state: UIState) => state.isSearchDrawerOpen
  );

  return (
    <footer
      style={{ height: "var(--footer-height)" }}
      className="lg:hidden  bg-black text-white flex justify-around items-center"
    >
      <button
        className={`flex flex-col items-center transition-transform duration-150 ${
          isCategoriesDrawerOpen
            ? "font-bold shadow-lg bg-white text-black px-4 py-2 rounded"
            : ""
        }`}
        onClick={toggleCategoriesDrawer}
      >
        <FaBars size={24} />
        <span className="text-xs mt-1">Categories</span>
      </button>
      <button
        className={`flex flex-col items-center transition-transform duration-150 ${
          isSearchDrawerOpen
            ? "font-bold shadow-lg bg-white text-black px-4 py-2 rounded"
            : ""
        }`}
        onClick={toggleSearchDrawer}
      >
        <FaSearch size={24} />
        <span className="text-xs mt-1">Search</span>
      </button>
      <button className="flex flex-col items-center">
        <FaShoppingBag size={24} />
        <span className="text-xs mt-1">Basket</span>
      </button>

      <ClerkLoaded>
        <AuthContent />
      </ClerkLoaded>
    </footer>
  );
}
