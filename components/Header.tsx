"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Icon, PackageIcon } from "@sanity/icons";
import Link from "next/link";
import { TrolleyIcon } from "@sanity/icons";
import { ClerkLoaded } from "@clerk/nextjs";
import logo from "../public/logo.svg";
import Image from "next/image";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";

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
    <header className="bg-black flex justify-center md:justify-between items-center px-4 md:px-10 h-[60px] md:h-[80px]">
      {/* Logo */}
      <div className="flex justify-center sm:mr-6 lg:ml-20">
        <Link href="/">
          <Image
            src={logo}
            alt="Sang Logium Logo"
            className="h-[52px] md:h-[60px]"
          />
        </Link>
      </div>

      {/* Search Input for Desktop */}
      <div className="hidden md:flex items-center flex-1 max-w-2xl  mr-6">
        <form
          action="/search"
          className="flex items-center w-full max-w-lg h-[32px]"
        >
          <FaSearch className="text-white mr-4  w-6 h-[100%]" />
          <input
            type="text"
            name="query"
            placeholder="SEARCH PRODUCTS"
            className="text-2xl flex-1 bg-transparent border-b border-white text-white placeholder-white focus:outline-none"
          />
        </form>
      </div>

      {/* Basket and User Icons for Desktop */}
      <div className="hidden md:flex items-center flex-1 justify-around max-w-40 lg:max-w-60 mt-1 lg:mr-5">
        <Link
          href="/basket"
          className="flex flex-col justify-center items-center space-x-2 text-white"
        >
          <FaShoppingCart className="w-[26px] h-[26px] text-white" />
          <span className="text-xl">Basket</span>
        </Link>

        <ClerkLoaded>
          {user ? (
            <div className="flex items-center justify-center space-x-2">
              <UserButton />
              <div className="hidden sm:block text-xs">
                <p className="text-white">Welcome back</p>
                <p className="font-bold text-white">{user.fullName}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              {/* <FaUser className="w-[32px] h-[32px] text-white" /> */}
              <FaUser className="w-[24px] h-[24px] text-white outline-none" />
              <div className="text-white text-xl mt-[2px]">
                <SignInButton mode="modal" />
              </div>
            </div>
          )}
          {user?.passkeys.length === 0 && (
            <button
              onClick={createClerkPasskey}
              className="bg-white hover:bg-white-700 hover:text-white animate-pulse text-white-500 font-bold py-2 px-4 rounded border-blue-300 border"
            >
              Create a passkey now
            </button>
          )}
        </ClerkLoaded>
      </div>
    </header>
  );
}

export default Header;
