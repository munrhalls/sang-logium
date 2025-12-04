"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export function DrawerToggleButton({
  param,
  children,
  className,
}: {
  param: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get(param) === "true";

  const href = isOpen ? pathname : `?${param}=true`;

  return (
    <Link href={href} className={className} scroll={false}>
      {children}
    </Link>
  );
}
