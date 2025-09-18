import { SignedIn } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";
import SignInBtn from "./SignInBtn";
import AuthenticatedView from "./AuthenticatedView";

// this component should not use the client side signedin/signedout
// should instead use server side auth state detection
// with that, it should return proper component - either SignedInBtn or AuthenticatedView
export default function Authentication() {
  return (
    <div className="text-white">
      <SignedIn>
        <AuthenticatedView />
      </SignedIn>
      <SignedOut>
        <SignInBtn />
      </SignedOut>
    </div>
  );
}
