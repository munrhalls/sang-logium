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

  // TODO this is wrong - url navigation MUST BE INSTANT FOR GOOD USER EXPERIENCE
  // however, the component may need time to mount
  // drawer container should be separate from drawer content in such a way that the drawer container mounts instantly and its slide in animation starts instantly
  // while the drawer content can load in with a spinner if needed - or with fingerbar skeleton on suspense fallback initially

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
