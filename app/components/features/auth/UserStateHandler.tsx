"use client";

const AuthenticatedView = dynamic(
  () =>
    import("./AuthenticatedView").then((mod) => ({
      default: mod.AuthenticatedView,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-[24px] h-[24px] bg-gray-800 rounded-full animate-pulse" />
    ),
  }
);

const UnauthenticatedView = dynamic(
  () =>
    import("./UnauthenticatedView").then((mod) => ({
      default: mod.UnauthenticatedView,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-[24px] h-[24px] bg-gray-800 rounded-full animate-pulse" />
    ),
  }
);

import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";

export default function UserStateHandler() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="w-[24px] h-[24px] bg-gray-800 rounded-full animate-pulse" />
    );
  }

  return user ? <AuthenticatedView /> : <UnauthenticatedView />;
}
