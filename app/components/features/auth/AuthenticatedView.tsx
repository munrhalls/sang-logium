// Remove unused imports
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
// import { KeyIcon } from "@heroicons/react/24/outline";
// import { useState } from "react";

export function AuthenticatedView() {
  const { user, isLoaded } = useUser();
  // const clerk = useClerk();
  // const [isCreatingPasskey, setIsCreatingPasskey] = useState(false);

  // const createClerkPasskey = async () => {
  //   if (!user) return;
  //   setIsCreatingPasskey(true);
  //   try {
  //     await clerk.authenticateWithWeb3({
  //       strategy: "web3_metamask_signature",
  //       redirectUrl: "/auth/callback",
  //     });
  //   } catch (err) {
  //     console.error("Failed to create passkey:", err);
  //   } finally {
  //     setIsCreatingPasskey(false);
  //   }
  // };

  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid place-content-center">
      <div className="grid place-content-center">
        <UserButton afterSignOutUrl="/" />
        {/* {user.passwordEnabled === false && (
          <div className="ml-2 flex items-center justify-center">
            <button
              onClick={createClerkPasskey}
              disabled={isCreatingPasskey}
              className="h-[28px] w-[28px] flex justify-center items-center bg-white hover:bg-white-700 hover:text-white animate-pulse text-white-500 font-bold p-2 rounded-full border-blue-300 border disabled:opacity-50"
            >
              <KeyIcon />
            </button>
          </div>
        )} */}
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
