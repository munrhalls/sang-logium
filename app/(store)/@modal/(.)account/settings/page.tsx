import { UserProfile } from "@clerk/nextjs";

export default function Settings() {
  return (
    <div className="flex flex-col items-center gap-4 align-middle">
      <h1>Your account settings</h1>
      <UserProfile />
    </div>
  );
}
