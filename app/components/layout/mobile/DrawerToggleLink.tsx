"use client";
import { usePathname, useRouter } from "next/navigation";

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

  const handleClick = () => {
    const href = isOpen ? pathname : `${pathname}?${param}=true`;
    router.push(href);
  };

  return (
    <button onClick={handleClick} className="flex flex-col items-center">
      {isOpen ? closeIcon : openIcon}
    </button>
  );
}
