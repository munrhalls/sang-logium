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
  }
);

export default function AuthContent() {
  // Using only isLoaded from useUser
  const { isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
  // Check both possible profile page routes
  const isProfilePage = pathname === "/account/profile" || pathname === "/(store)/account/profile";

  if (!isLoaded) {
    return (
      <div className="w-[24px] h-[24px] mx-auto bg-gray-800 rounded-full animate-pulse" />
    );
  }

  return (
    <div className="flex flex-col items-center">
      <AuthenticatedView />
      {isSignedIn && !isProfilePage && (
        <Link 
          href="/account/profile"
          className="text-xs text-blue-300 hover:text-blue-200 mt-1"
        >
          My Profile
        </Link>
      )}
    </div>
  );
}
