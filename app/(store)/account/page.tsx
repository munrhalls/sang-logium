"use client";

import { UserProfile } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function AccountPage() {
  const { userId } = useAuth();
  
  // Redirect if not authenticated (client-side protection in addition to middleware)
  if (!userId) {
    redirect("/");
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Account</h1>
      <div className="bg-white rounded-lg shadow">
        <UserProfile path="/account" />
      </div>
    </div>
  );
}