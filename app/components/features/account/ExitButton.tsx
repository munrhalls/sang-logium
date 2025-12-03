"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function ExitButton() {
  const router = useRouter();

  const handleExit = () => {
    router.back();
  };

  return (
    <button
      onClick={handleExit}
      className="mx-auto flex w-8 flex-col items-center rounded-lg bg-black py-2 font-medium text-white transition-colors hover:bg-gray-800 sm:w-10 sm:py-3"
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
}
