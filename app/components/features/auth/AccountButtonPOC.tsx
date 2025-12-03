"use client";
import { useUser } from "@clerk/nextjs";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import savePreDrawerUrl from "@/lib/utils/navigation";
export default function AccountButtonPOC() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  if (!isLoaded || !user) return null;

  const handleAccountDrawerOpen = () => {
    const search = searchParams.toString();
    const currentUrl = search ? `${pathname}?${search}` : pathname;
    savePreDrawerUrl(currentUrl);
    router.prefetch(currentUrl);
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
