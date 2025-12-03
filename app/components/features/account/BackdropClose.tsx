"use client";

import { useRouter } from "next/navigation";

export default function BackdropClose() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bottom-14 top-[4rem] z-40 sm:bottom-0 sm:top-[6rem] md:bg-black/50"
    />
  );
}
