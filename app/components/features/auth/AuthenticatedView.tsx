"use client";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { DotIcon } from "lucide-react";

export default function AuthenticatedView() {
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) {
    return (
      <div className="text-white flex justify-center items-center">
        Loading...
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center">
      <div className="grid place-content-center">
        <div className="grid place-content-center">
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Open chat"
                labelIcon={<DotIcon />}
                onClick={() => alert("init chat")}
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
        <div
          style={{ lineHeight: "16px" }}
          className="hidden sm:flex items-center justify-center"
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
