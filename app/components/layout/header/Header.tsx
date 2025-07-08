"use client";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ShoppingCartIcon, UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import logo from "@/public/logo.svg";
const AuthContent = dynamic(
  () => import("@/app/components/features/auth/AuthContent"),
  {
    loading: () => (
      <div className="w-[24px] h-[24px] mx-auto bg-gray-800 rounded-full animate-pulse" />
    ),
    ssr: false,
  },
);
const SearchForm = dynamic(
  () => import("@/app/components/features/homepage/search/SearchForm"),
  {
    loading: () => <div className="animate-pulse" />,
    ssr: false,
  },
);
const ProfileSync = dynamic(
  () => import("@/app/components/features/auth/ProfileSync"),
  { ssr: false },
);
function Header() {
  return (
    <header className="bg-black grid place-content-center grid-flow-col lg:grid-cols-[3fr_4fr_4fr] h-[4rem]">
      <Link href="/" className="grid place-content-center">
        <Image
          src={logo}
          alt="Logo"
          height={50}
          width={180}
          unoptimized
          priority
        />
      </Link>
      <div className="hidden lg:grid lg:place-content-center">
        <SearchForm />
      </div>
      <div className="hidden lg:grid place-content-center grid-flow-col gap-8">
        <Link href="/basket" className="text-white" prefetch={false}>
          <div className="grid place-content-center">
            <ShoppingCartIcon height={24} width={24} />
          </div>
          <span>Basket</span>
        </Link>
        <ProfileSync />
        <SignedIn>
          <AuthContent />
        </SignedIn>
        <SignedOut>
          <div className="grid place-content-center text-white">
            <SignInButton mode="modal">
              <div className="flex flex-col items-center">
                <div className="grid place-content-center">
                  <UserIcon height={24} width={24} />
                </div>
                <span>Sign In</span>
              </div>
            </SignInButton>
          </div>
        </SignedOut>
      </div>
    </header>
  );
}
export default Header;
