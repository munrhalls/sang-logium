import { SignInButton } from "@clerk/nextjs";
import { UserIcon } from "@heroicons/react/24/outline";

export function UnauthenticatedView() {
  return (
    <div className="grid place-content-center  text-white">
      <div className="grid place-content-center">
        <UserIcon className="w-[24px] h-[24px] text-white" />
      </div>
      <SignInButton mode="modal">
        <button className="grid place-content-center">
          <span className="text-white">Sign in</span>
        </button>
      </SignInButton>
    </div>
  );
}
