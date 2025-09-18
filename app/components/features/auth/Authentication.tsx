import { SignedIn } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";
import SignInBtn from "./SignInBtn";
import AuthenticatedView from "./AuthenticatedView";

export default async function Authentication() {
  return (
    <div className="text-white">
      <AuthenticatedView />

      {/* <SignedIn>
        <AuthenticatedView />
      </SignedIn>
      <SignedOut>
        <SignInBtn />
      </SignedOut> */}
    </div>
  );
}
