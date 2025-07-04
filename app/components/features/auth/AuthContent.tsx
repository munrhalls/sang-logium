"use client";

import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AuthenticatedView = dynamic(
  () => import("./AuthenticatedView").then((mod) => mod.AuthenticatedView),
  {
    ssr: false,
    loading: () => (
      <div className="w-[24px] h-[24px] mx-auto bg-blue-500 rounded-full animate-pulse" />
    ),
  },
);

export default function AuthContent() {
  const { isLoaded } = useUser();
  const pathname = usePathname();

  const _isProfilePage =
    pathname === "/account" || pathname === "/(store)/account";

  if (!isLoaded) {
    return (
      <div className="w-[24px] h-[24px] mx-auto bg-gray-800 rounded-full animate-pulse" />
    );
  }

  return (
    <div className="flex flex-col items-center">
      <AuthenticatedView />
    </div>
  );
}
