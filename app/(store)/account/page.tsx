"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function AccountPage() {
  useEffect(() => {
    redirect("/account/profile");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500"></div>
    </div>
  );
}
