"use client";

import { ClerkLoaded } from "@clerk/nextjs";
import Link from "next/link";
import Logo from "@/public/Logo.svg";
import dynamic from "next/dynamic";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

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
    <header className=" bg-black grid place-content-center grid-flow-col lg:grid-cols-[3fr_4fr_4fr] h-[4rem]">
      <Link href="/" className="grid place-content-center">
        <Logo width={180} height={60} />
      </Link>

      <SearchForm />

      <div className="hidden lg:grid place-content-center grid-flow-col gap-8">
        <Link href="/basket" className=" text-white">
          <div className="grid place-content-center">
            <ShoppingCartIcon height={24} width={24} />
          </div>
          <span>Basket</span>
        </Link>

        <ClerkLoaded>
          <AuthContent />
        </ClerkLoaded>
      </div>
    </header>
  );
}

export default Header;
