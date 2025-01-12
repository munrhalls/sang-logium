"use client";

import { ClerkLoaded } from "@clerk/nextjs";
// import { ClerkLoaded, SignInButton, UserButton, useUser } from "@clerk/nextjs";

import Link from "next/link";
import logo from "../../public/logo.svg";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
// import { UserIcon, KeyIcon } from "@heroicons/react/24/outline";

const AuthContent = dynamic(
  () => import("@/components/features/auth/AuthContent"),
  {
    loading: () => (
      <div className="w-[26px] h-[26px] mx-auto bg-gray-800 rounded-full animate-pulse" />
    ),
    ssr: false,
  }
);
const SearchForm = dynamic(() => import("./SearchForm"), {
  loading: () => (
    <div className="h-[32px] w-full max-w-72 lg:max-w-96 xl:max-w-xl 2xl:max-w-2xl hidden lg:flex items-center bg-gray-800 animate-pulse" />
  ),
});

function Header() {
  return (
    <header
      style={{ height: "var(--header-height)" }}
      className="fixed top-0 left-0 right-0 z-50 lg:px-10 xl:px-16 2xl:px-24 flex justify-center lg:justify-between items-center bg-black"
    >
      <Link href="/">
        <Image
          src={logo}
          alt="Sang Logium Logo"
          className="h-[52px] lg:h-[60px]"
          priority
          width={150}
          height={60}
        />
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
