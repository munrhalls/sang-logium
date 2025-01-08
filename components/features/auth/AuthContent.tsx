"use client";
import dynamic from "next/dynamic";
import { useUser } from "@clerk/nextjs";

const AuthenticatedView = dynamic(
  () => import("./AuthenticatedView").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-[28px] h-[28px] bg-gray-800 rounded-full animate-pulse" />
    ),
  }
);

const UnauthenticatedView = dynamic(
  () => import("./UnauthenticatedView").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="w-[24px] h-[24px] bg-gray-800 rounded-full animate-pulse" />
    ),
  }
);

export default function AuthContent() {
  const { user } = useUser();

  return user ? <AuthenticatedView /> : <UnauthenticatedView />;
}
