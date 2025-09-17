"use client";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

export default function AuthenticatedView() {
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) {
    return <div className="text-red-700">Loading...</div>;
  }
  return (
    <div className="flex flex-col items-center">
      <div className="grid place-content-center">
        <div className="grid place-content-center">
          <UserButton />
        </div>
        <div
          style={{ lineHeight: "16px" }}
          className="flex items-center justify-center"
        >
          <p className="text-white text-xs md:text-sm mr-1">Welcome back,</p>
          <p className="font-semibold text-xs md:text-sm text-white">
            {" "}
            {` ${user?.fullName}`}
          </p>
        </div>
      </div>
    </div>
  );
}
