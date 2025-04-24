"use client";
import { useClerk } from "@clerk/nextjs";
import { UserButton as ClerkUserButton } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export function CustomUserButton() {
  const { signOut } = useClerk();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    console.log("Logging out...");
    try {
      await signOut();
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="relative">
      <div 
        onClick={() => setShowMenu(!showMenu)}
        ref={buttonRef}
        className="cursor-pointer"
      >
        <ClerkUserButton 
          appearance={{
            elements: {
              // This prevents the Clerk dropdown menu from showing
              userButtonPopoverCard: "hidden",
              userButtonTrigger: "focus:outline-none"
            }
          }}
        />
      </div>
      
      {showMenu && (
        <div 
          ref={menuRef}
          className="absolute top-full right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 overflow-hidden border border-gray-200"
        >
          <div className="py-1">
            <Link
              href="/account/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors font-medium"
              onClick={() => setShowMenu(false)}
            >
              MY ACCOUNT
            </Link>
            <div className="border-t border-gray-100"></div>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors font-medium"
            >
              LOG OUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}