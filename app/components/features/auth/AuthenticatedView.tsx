"use client";
import { useUser } from "@clerk/nextjs";
import { CustomUserButton } from "./CustomUserButton";

export function AuthenticatedView() {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid place-content-center">
      <div className="grid place-content-center">
        <CustomUserButton />
      </div>
      <div
        style={{ lineHeight: "16px" }}
        className="flex items-center justify-center"
      >
        <p className="text-white text-xs md:text-sm mr-1">Welcome back,</p>
        <p className="font-semibold text-xs md:text-sm text-white">
          {" "}
          {` ${user.fullName}`}
        </p>
      </div>
    </div>
  );
}
