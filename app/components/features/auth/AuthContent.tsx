"use client";

import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";

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
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="w-[24px] h-[24px] mx-auto bg-gray-800 rounded-full animate-pulse" />
    );
  }

  return <AuthenticatedView />;
}
