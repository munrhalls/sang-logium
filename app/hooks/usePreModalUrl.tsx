"use client";

import { usePathname, useSearchParams } from "next/navigation";

const STORAGE_KEY = "pre_modal_url";

export function usePreModalUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const saveCurrent = () => {
    const search = searchParams.toString();
    const currentUrl = search ? `${pathname}?${search}` : pathname;
    sessionStorage.setItem(STORAGE_KEY, currentUrl);
  };

  const getPrevious = () => {
    return sessionStorage.getItem(STORAGE_KEY) || pathname;
  };

  return { saveCurrent, getPrevious };
}
