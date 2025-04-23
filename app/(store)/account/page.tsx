"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function AccountPage() {
  // Automatically redirect to the profile page
  useEffect(() => {
    redirect("/account/profile");
  }, []);

  // Return a loading state (will be briefly shown before redirect)
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500"></div>
    </div>
  );
}