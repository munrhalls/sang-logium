"use client";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export function DrawerToggleLink({
  isOpen,
  param,
  openIcon,
  closeIcon,
  label: _label,
}: {
  isOpen: boolean;
  param: string;
  openIcon: React.ReactNode;
  closeIcon: React.ReactNode;
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    const href = isOpen ? pathname : `${pathname}?${param}=true`;

    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center"
      disabled={isPending}
      style={{ opacity: isPending ? 0.7 : 1 }}
    >
      {isOpen ? closeIcon : openIcon}
    </button>
  );
}
