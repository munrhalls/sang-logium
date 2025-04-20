"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const AuthenticatedView = dynamic(
  () => import("./AuthenticatedView").then((mod) => mod.AuthenticatedView),
  {
    ssr: false,
  }
);

const UnauthenticatedView = dynamic(
  () => import("./UnauthenticatedView").then((mod) => mod.UnauthenticatedView),
  {
    ssr: false,
  }
);

export default function AuthContent() {
  const { isLoaded, user } = useUser();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || !isLoaded) {
    return (
      <div className="w-[24px] h-[24px] mx-auto bg-gray-800 rounded-full animate-pulse" />
    );
  }

  return user ? <AuthenticatedView /> : <UnauthenticatedView />;
}
