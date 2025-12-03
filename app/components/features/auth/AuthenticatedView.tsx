"use client";
import { useUser } from "@clerk/nextjs";
import AccountButtonPOC from "./AccountButtonPOC";
export default function AuthenticatedView() {
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center">
      <div className="grid place-content-center">
        <div className="relative grid place-content-center">
          <AccountButtonPOC />
        </div>
        <div
          style={{ lineHeight: "16px" }}
          className="hidden items-center justify-center sm:flex"
        >
          <p className="mr-1 text-xs text-white md:text-sm">Welcome back,</p>
          <p className="text-xs font-semibold text-white md:text-sm">
            {` ${user?.fullName}`}
          </p>
        </div>
      </div>
    </div>
  );
}
