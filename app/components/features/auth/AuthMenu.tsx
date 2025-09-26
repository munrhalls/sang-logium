// components/CustomUserDrawer.tsx
"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

export default function AuthMenu() {
  const { user, isLoaded } = useUser(); // Get user data and loading state
  const { signOut } = useClerk(); // For sign-out
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoaded) return <div>Loading...</div>; // Show placeholder while loading

  return (
    <>
      {/* Trigger: Avatar button */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-black w-8 h-8 bg-blue-500  rounded-full"
      >
        {user?.firstName?.[0] || "U"}
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="text-black fixed top-0 right-0 w-64 h-full bg-white shadow-lg">
          <button onClick={() => setIsOpen(false)}>Close</button>
          <div>
            <p>Welcome, {user?.firstName || "Guest"}!</p>
            <button
              onClick={() => clerk.openUserProfile()}
              className="flex items-center space-x-2 p-2 w-full text-left hover:bg-gray-100 rounded"
            >
              <span>Manage Account</span>
            </button>
            <nav>
              <Link href="/orders">Orders</Link>
              <button onClick={() => alert("init chat")}>Open Chat</button>
              <button onClick={() => signOut({ redirectUrl: "/" })}>
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
