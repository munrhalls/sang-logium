import { SignInButton } from "@clerk/nextjs";
import { UserIcon } from "@heroicons/react/24/outline";

export function UnauthenticatedView() {
  return (
    <div className="flex flex-col justify-center items-center space-x-2 text-white">
      <UserIcon className="w-[24px] h-[24px] text-white" />
      <SignInButton mode="modal">
        <button className="pt-[1px]">
          <span className="text-white text-xl">Sign in</span>
        </button>
      </SignInButton>
    </div>
  );
}
