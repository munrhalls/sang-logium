"use client";

import { FaBars, FaSearch, FaShoppingBag, FaUser, FaKey } from "react-icons/fa";
import { useStore } from "../../../store";
import { ClerkLoaded } from "@clerk/nextjs";
// import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { UIState } from "../../../store";
import AuthContent from "@/components/features/auth/AuthContent";

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
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-black text-white flex justify-around items-center"
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
      {/* <button className="flex flex-col items-center">
        <FaUser size={24} />
        <span className="text-xs mt-1">Account</span>
      </button> */}
      {/* `<ClerkLoaded>
        <div>
          {user ? (
            <div className="mt-2 flex flex-col justify-center">
              <div className="mb-1 flex justify-center items-center">
                <UserButton />

                {user?.passkeys.length === 0 && (
                  <div className="ml-2 flex items-center justify-center">
                    <button
                      onClick={createClerkPasskey}
                      className="h-[28px] w-[28px] flex justify-center items-center bg-white hover:bg-white-700 hover:text-white animate-pulse text-black font-bold p-2 rounded-full border-blue-300 border"
                    >
                      <FaKey />
                    </button>
                  </div>
                )}
              </div>
              <div
                style={{ lineHeight: "16px" }}
                className="flex items-center justify-center"
              >
                <p className="text-white">Welcome back</p>
                <span className="font-bold text-white">{user.fullName}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <FaUser className="w-[24px] h-[24px] text-white outline-none" />
              <div className="text-white text-xs mt-1">
                <SignInButton mode="modal" />
              </div>
            </div>
          )}
        </div>
      </ClerkLoaded>` */}

      <ClerkLoaded>
        <AuthContent />
      </ClerkLoaded>
    </footer>
  );
}
