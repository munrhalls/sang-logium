"use client";

import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";

export default function InterceptedAccountSettings() {
  console.log("POC: Intercepted route loaded");

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Account Settings</h2>
          <Link href="/" className="text-2xl hover:opacity-70">
            ×
          </Link>
        </div>

        <UserProfile
          routing="virtual"
          appearance={{
            elements: {
              rootBox: { width: "100%" },
              card: {
                border: "none",
                boxShadow: "none",
                borderRadius: "0",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
