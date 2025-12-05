"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function DrawerToggleLink({
  isOpen,
  param,
  openIcon,
  closeIcon,
  label,
}: {
  isOpen: boolean;
  param: string;
  openIcon: React.ReactNode;
  closeIcon: React.ReactNode;
  label: string;
}) {
  const pathname = usePathname();
  const href = isOpen ? pathname : `${pathname}?${param}=true`;

  return (
    <Link
      href={href}
      className="flex flex-col items-center"
      aria-label={isOpen ? `Close ${label}` : `Open ${label}`}
    >
      {isOpen ? closeIcon : openIcon}
    </Link>
  );
}
