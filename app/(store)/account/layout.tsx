"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useUser();

  // Handle loading state
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    redirect("/sign-in?redirect_url=/account");
  }

  return <>{children}</>;
}