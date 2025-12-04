"use client";
import { usePathname, useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

export function CloseDrawerButton() {
  const pathname = usePathname();
  const router = useRouter();

  const handleClose = () => {
    router.push(pathname);
  };

  return (
    <button
      onClick={handleClose}
      className="flex items-center justify-center gap-1 text-black"
    >
      <span>CLOSE</span>
      <FaTimes size={14} />
    </button>
  );
}
