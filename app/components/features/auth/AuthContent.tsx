"use client";
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
  return (
    <div className="flex flex-col items-center">
      <AuthenticatedView />
    </div>
  );
}
