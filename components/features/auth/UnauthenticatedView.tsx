import { UserIcon } from "@heroicons/react/24/outline";
import { SignInButton } from "./AuthButtons";

export function UnauthenticatedView() {
  return (
    <div className="flex flex-col justify-center items-center">
      <UserIcon className="w-[24px] h-[24px] text-white outline-none" />
      <div className="text-white text-xl mt-[2px]">
        <SignInButton mode="modal" />
      </div>
    </div>
  );
}
