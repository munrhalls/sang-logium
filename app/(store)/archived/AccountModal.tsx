"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function AccountModal() {
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const shouldShow = pathname.endsWith("/account") || pathname === "/account";
  useEffect(() => {
    if (shouldShow) {
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [shouldShow]);
  if (!shouldShow) return null;
  const handleClose = () => {
    setIsVisible(false);
    const basePath = pathname === "/account" ? "/" : pathname.slice(0, -8); 
    setTimeout(() => {
      router.push(basePath);
    }, 300); 
  };
  return (
    <>
      {}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />
      {}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-out ${
            isVisible ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="p-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
          {}
          <div className="text-sm text-gray-600 mb-4">
            <p>Current path: {pathname}</p>
            <p>
              Base path: {pathname === "/account" ? "/" : pathname.slice(0, -8)}
            </p>
          </div>
          {}
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold">Profile</h3>
              <p className="text-gray-600">Manage your profile information</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold">Security</h3>
              <p className="text-gray-600">Password and authentication</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-semibold">Preferences</h3>
              <p className="text-gray-600">Customize your experience</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
