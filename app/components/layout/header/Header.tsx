"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import logo from "@/public/logo.svg";
import SearchForm from "../../features/homepage/search/SearchForm";

const Authentication = dynamic(
  () => import("@/app/components/features/auth/Authentication"),
  {
    loading: () => (
      <div className="flex text-white">
        <div className="mx-auto h-[24px] w-[24px] animate-pulse rounded-full bg-blue-700" />
        <span className="pl-2">Loading...</span>
      </div>
    ),
    ssr: false,
  }
);

export default function Header() {
  return (
    <header className="grid h-[4rem] grid-flow-col place-content-center bg-black lg:grid-cols-[3fr_4fr_4fr]">
      <Link href="/" className="grid place-content-center">
        <Image src={logo} alt="Logo" height={50} width={180} priority />
      </Link>
      <div className="hidden lg:grid lg:place-content-center">
        <SearchForm />
      </div>
      <div className="hidden grid-flow-col place-content-center gap-8 lg:grid">
        <Authentication />

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
