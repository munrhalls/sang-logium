"use client";

import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { UserIcon, KeyIcon } from "@heroicons/react/24/outline";

export default function AuthContent() {
  const { user } = useUser();
  const createClerkPasskey = async () => {
    try {
      const response = await user?.createPasskey();
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return user ? (
    <div className="mt-2 flex flex-col justify-center">
      <div className="mb-1 flex justify-center items-center">
        <UserButton />
        {user?.passkeys.length === 0 && (
          <div className="ml-2 flex items-center justify-center">
            <button
              onClick={createClerkPasskey}
              className="h-[28px] w-[28px] flex justify-center items-center bg-white hover:bg-white-700 hover:text-white animate-pulse text-white-500 font-bold p-2 rounded-full border-blue-300 border"
            >
              <KeyIcon />
            </button>
          </div>
        )}
      </div>
      <div
        style={{ lineHeight: "16px" }}
        className="flex flex-col items-center justify-center"
      >
        <p className="text-white">Welcome back</p>
        <p className="font-bold text-white">{user.fullName}</p>
      </div>
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center">
      <UserIcon className="w-[24px] h-[24px] text-white outline-none" />
      <div className="text-white text-xl mt-[2px]">
        <SignInButton mode="modal" />
      </div>
    </div>
  );
}
