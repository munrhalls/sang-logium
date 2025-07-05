"use client";
import dynamic from "next/dynamic";
const SignInButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignInButton),
  {
    ssr: false,
    loading: () => (
      <div className="w-[24px] h-[24px] bg-gray-800 rounded-full animate-pulse" />
    ),
  },
);
const UserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.UserButton),
  {
    ssr: false,
    loading: () => (
      <div className="w-[24px] h-[24px] bg-gray-800 rounded-full animate-pulse" />
    ),
  },
);
export { SignInButton, UserButton };
