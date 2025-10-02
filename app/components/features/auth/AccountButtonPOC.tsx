"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function AccountButtonPOC() {
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) return null;

  return (
    <Link
      href="/account"
      className="w-10 h-10 rounded-full bg-blue-500  flex items-center justify-center hover:bg-blue-600 text-black"
    >
      {user.firstName?.[0] || "U"}
    </Link>
  );
}
