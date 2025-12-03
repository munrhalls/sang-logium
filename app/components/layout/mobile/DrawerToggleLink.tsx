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
  const href = isOpen ? pathname : `?${param}=true`;

  return (
    <Link href={href} className="flex flex-col items-center">
      {isOpen ? closeIcon : openIcon}
    </Link>
  );
}
