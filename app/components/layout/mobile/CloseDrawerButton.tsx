"use client";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { FaTimes } from "react-icons/fa";

export function CloseDrawerButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClose = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <button
      onClick={handleClose}
      className="flex items-center justify-center gap-1 text-black"
      disabled={isPending}
      style={{ opacity: isPending ? 0.7 : 1 }}
    >
      <span>CLOSE</span>
      <FaTimes size={14} />
    </button>
  );
}
