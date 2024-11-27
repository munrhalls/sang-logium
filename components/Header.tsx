"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Icon, PackageIcon } from "@sanity/icons";
import Link from "next/link";
import { TrolleyIcon } from "@sanity/icons";
import { ClerkLoaded } from "@clerk/nextjs";
import logo from "../public/logo.svg";
import Image from "next/image";
import { FaSearch, FaUser, FaShoppingCart, FaKey } from "react-icons/fa";

function Header() {
  const { user } = useUser();

  console.log(user);

  const createClerkPasskey = async () => {
    try {
      const response = await user?.createPasskey();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="lg:px-10 xl:px-16 2xl:px-24 h-[60px] lg:h-[90px] flex justify-center lg:justify-between items-center bg-black">
      {/* Logo */}
      <Link href="/">
        <Image
          src={logo}
          alt="Sang Logium Logo"
          className="h-[52px] lg:h-[60px]"
        />
      </Link>

      {/* Search Input for Desktop */}
      <form
        action="/search"
        className="h-[32px] w-full max-w-72 lg:max-w-96 xl:max-w-xl 2xl:max-w-2xl hidden lg:flex items-center"
      >
        <FaSearch className="text-white mr-4  w-6 h-[100%]" />
        <input
          type="text"
          name="query"
          placeholder="SEARCH PRODUCTS"
          className="text-2xl flex-1 bg-transparent border-b border-white text-white placeholder-white focus:outline-none"
        />
      </form>

      {/* Basket and User Icons for Desktop */}
      <div className="hidden lg:grid grid-cols-2 gap-2 items-center justify-around">
        <Link
          href="/basket"
          className="xl:mr-8 2xl:mr-16 flex flex-col justify-center items-center space-x-2 text-white"
        >
          <FaShoppingCart className="w-[26px] h-[26px] text-white" />
          <span className="text-xl">Basket</span>
        </Link>

        <ClerkLoaded>
          <div>
            {user ? (
              <div className="mt-2 flex flex-col justify-center">
                <div className="mb-1 flex justify-center items-center">
                  <UserButton />

                  {user?.passkeys.length === 0 && (
                    <div className="ml-2 flex items-center justify-center">
                      <button
                        onClick={createClerkPasskey}
                        className="h-[28px] w-[28px] flex justify-center items-center bg-white hover:bg-white-700 hover:text-white animate-pulse text-white-500 font-bold p-2 rounded-full border-blue-300 border"
                      >
                        <FaKey />
                      </button>
                    </div>
                  )}
                </div>
                <div
                  style={{ lineHeight: "16px" }}
                  className="flex flex-col items-center justify-center"
                >
                  <p className="text-white">Welcome back</p>
                  <p className="font-bold text-white">{user.fullName}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <FaUser className="w-[24px] h-[24px] text-white outline-none" />
                <div className="text-white text-xl mt-[2px]">
                  <SignInButton mode="modal" />
                </div>
              </div>
            )}
          </div>
        </ClerkLoaded>
      </div>
    </header>
  );
}

export default Header;
