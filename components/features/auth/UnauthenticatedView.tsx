import { SignInButton } from "@clerk/nextjs";

export function UnauthenticatedView() {
  return (
    <div className="mt-2">
      <SignInButton mode="modal">
        <button className="text-white">Sign in</button>
      </SignInButton>
    </div>
  );
}
