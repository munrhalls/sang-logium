"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import logo from "@/public/logo.svg";

// Authentication component - dynamically imported, displays loader initially, ssr: false -> then outputs the proper authentication html based on the clerk based state of authentication
// const AuthenticationComponent = dynamic( () => import )

const Authentication = dynamic(
  () => import("@/app/components/features/auth/Authentication"),
  {
    loading: () => (
      <div className="flex text-white">
        <div className="w-[24px] h-[24px] mx-auto bg-blue-700 rounded-full animate-pulse" />
        Loading...
      </div>
    ),
    ssr: false,
  }
);

// const SearchForm = dynamic(
//   () => import("@/app/components/features/homepage/search/SearchForm"),
//   {
//     loading: () => <div className="animate-pulse" />,
//     ssr: false,
//   }
// );

export default function Header() {
  return (
    <header className="bg-black grid place-content-center grid-flow-col lg:grid-cols-[3fr_4fr_4fr] h-[4rem]">
      <Link href="/" className="grid place-content-center">
        <Image src={logo} alt="Logo" height={50} width={180} priority />
      </Link>
      <div className="hidden lg:grid lg:place-content-center">
        {/* <SearchForm /> */}
      </div>
      <div className="hidden lg:grid place-content-center grid-flow-col gap-8">
        <Authentication />
        {/* This should be a nice, simple, intuitive button that clearly indicates user will end up viewing his orders */}

        <Link
          href="/orders"
          className="text-white flex justify-center items-center"
        >
          ORDERS
        </Link>
        <Link href="/basket" className="text-white" prefetch={false}>
          <div className="grid place-content-center">
            <ShoppingCartIcon height={24} width={24} />
          </div>
          <span>Basket</span>
        </Link>
      </div>
    </header>
  );
}
