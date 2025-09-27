"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

export default function AccountButtonPOC() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoaded || !user) return null;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        // href="/account"
        className="w-10 h-10 rounded-full bg-blue-500  flex items-center justify-center hover:bg-blue-600 text-black"
      >
        {user.firstName?.[0] || "U"}
      </button>

      {/* Simple Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-40 border text-black">
          <Link
            href="/account/settings"
            className="block px-4 py-2 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Manage Account (POC)
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 border-t  text-black"
          >
            Log Out
          </button>
        </div>
      )}
    </>
  );
}
