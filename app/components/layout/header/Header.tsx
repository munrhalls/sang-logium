"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import logo from "@/public/logo.svg";
import SearchForm from "../../features/homepage/search/SearchForm";
import { ClipboardListIcon } from "lucide-react";

const Authentication = dynamic(
  () => import("@/app/components/features/auth/Authentication"),
  {
    loading: () => (
      <div className="flex text-white">
        <div className="w-[24px] h-[24px] mx-auto bg-blue-700 rounded-full animate-pulse" />
        <span className="pl-2">Loading...</span>
      </div>
    ),
    ssr: false,
  }
);

export default function Header() {
  return (
    <header className="bg-black grid place-content-center grid-flow-col lg:grid-cols-[3fr_4fr_4fr] h-[4rem]">
      <Link href="/" className="grid place-content-center">
        <Image src={logo} alt="Logo" height={50} width={180} priority />
      </Link>
      <div className="hidden lg:grid lg:place-content-center">
        <SearchForm />
      </div>
      <div className="hidden lg:grid place-content-center grid-flow-col gap-8">
        <Authentication />
        <Link href="/orders" className="text-white" prefetch={false}>
          <div className="grid place-content-center">
            <ClipboardListIcon />
          </div>

          <span>Orders</span>
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
