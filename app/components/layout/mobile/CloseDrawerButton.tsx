"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";

export function CloseDrawerButton() {
  const pathname = usePathname();
  return (
    <Link
      href={pathname}
      className="flex items-center justify-center gap-1 text-black"
    >
      <span>CLOSE</span>
      <FaTimes size={14} />
    </Link>
  );
}
