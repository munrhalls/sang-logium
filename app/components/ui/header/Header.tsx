"use client";

import { ClerkLoaded } from "@clerk/nextjs";
// import { ClerkLoaded, SignInButton, UserButton, useUser } from "@clerk/nextjs";

import Link from "next/link";
import Logo from "@/public/Logo.svg";
import dynamic from "next/dynamic";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
// import { UserIcon, KeyIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const AuthContent = dynamic(
  () => import("@/app/components/features/auth/AuthContent"),
  {
    loading: () => (
      <div className="w-[26px] h-[26px] mx-auto bg-gray-800 rounded-full animate-pulse" />
    ),
    ssr: false,
  }
);
const SearchForm = dynamic(
  () => import("@/app/components/features/search/SearchForm"),
  {
    loading: () => (
      <div className="h-[32px] w-full max-w-72 lg:max-w-96 xl:max-w-xl 2xl:max-w-2xl hidden lg:flex items-center bg-gray-800 animate-pulse" />
    ),
  }
);

function Header() {
  return (
    <header className=" bg-black grid place-content-center grid-flow-col lg:grid-cols-[3fr_4fr_2fr_1fr] h-[3rem]">
      <Link href="/" className="grid place-content-center">
        <Logo width={124} height={48} />
      </Link>

      <SearchForm />

      <div className="max-w-48 hidden lg:grid grid-cols-2 gap-2 items-center justify-evenly">
        <Link
          href="/basket"
          className="flex flex-col justify-center items-center space-x-2 text-white"
        >
          <ShoppingCartIcon className="w-[26px] h-[26px] text-white" />
          <span className="text-xl">Basket</span>
        </Link>

        <ClerkLoaded>
          <AuthContent />
        </ClerkLoaded>
      </div>
    </header>
  );
}

export default Header;
