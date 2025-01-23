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
      <div className="w-[24px] h-[24px] mx-auto bg-gray-800 rounded-full animate-pulse" />
    ),
    ssr: false,
  }
);
const SearchForm = dynamic(
  () => import("@/app/components/features/search/SearchForm"),
  {
    loading: () => <div className="animate-pulse" />,
  }
);

function Header() {
  return (
    <header className=" bg-black grid place-content-center grid-flow-col lg:grid-cols-[3fr_4fr_3fr_1fr] h-[4rem]">
      <Link href="/" className="grid place-content-center">
        <Logo width={180} height={60} />
      </Link>

      <SearchForm />

      <div className="hidden lg:grid place-content-center grid-flow-col space-x-4">
        <Link href="/basket" className=" text-white grid place-content-center">
          <div className="grid place-content-center">
            <ShoppingCartIcon height={24} width={24} className=" text-white" />
          </div>
          <span className="">Basket</span>
        </Link>

        <ClerkLoaded>
          <AuthContent />
        </ClerkLoaded>
      </div>
    </header>
  );
}

export default Header;
