"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function AccountButtonPOC() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  if (!isLoaded || !user) return null;

  const handleAccountDrawerOpen = () => {
    router.push("/account");
  };
  return (
    <button
      onClick={handleAccountDrawerOpen}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-black hover:bg-blue-600"
    >
      {user.firstName?.[0] || "dear customer"}
    </button>
  );
}
