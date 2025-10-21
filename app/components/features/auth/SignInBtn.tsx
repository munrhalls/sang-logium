import { SignInButton } from "@clerk/nextjs";
import { UserIcon } from "lucide-react";
export default function SignInBtn() {
  return (
    <SignInButton mode="modal">
      <div className="flex flex-col items-center">
        <div className="grid place-content-center">
          <UserIcon height={24} width={24} />
        </div>
        <span className="hidden sm:inline-block">Sign In</span>
      </div>
    </SignInButton>
  );
}
