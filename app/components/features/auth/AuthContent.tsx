"use client";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
const AuthenticatedView = dynamic(
  () => import("./AuthenticatedView").then((mod) => mod.AuthenticatedView),
  {
    loading: () => (
      <div className="w-[24px] h-[24px] mx-auto bg-blue-500 rounded-full animate-pulse" />
    ),
    ssr: false,
  }
);
export default function AuthContent() {
  const { isLoaded } = useUser();
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
