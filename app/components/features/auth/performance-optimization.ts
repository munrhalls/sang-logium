"use client";
import { useEffect } from "react";
let isUserDataCached = false;
export function usePrefetchClerkResources() {
  useEffect(() => {
    if (!isUserDataCached) {
      const prefetchResources = async () => {
        try {
          const link = document.createElement("link");
          link.rel = "prefetch";
          link.href = "clerk.com";
          link.as = "script";
          document.head.appendChild(link);
          isUserDataCached = true;
        } catch {}
      };
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(prefetchResources, { timeout: 5000 });
      } else {
        setTimeout(prefetchResources, 500);
      }
    }
  }, []);
}
export function useAuthSessionCache() {
  return {
    clearSessionCache: () => {
      try {
        sessionStorage.removeItem("user_display_info");
      } catch {}
    },
  };
}
export const getOptimizedClerkOptions = () => {
  return {
    appearance: {
      layout: {
        shimmer: true,
        logoPlacement: "none",
      },
      variables: {
        colorPrimary: "rgb(0, 0, 0)",
      },
      elements: {
        card: "rounded shadow-none",
        formButtonPrimary: "bg-black",
        footerActionLink: "text-black",
        formFieldInput: "border-2 border-gray-300 focus:border-black",
      },
    },
    navigate: (to: string) => {
      window.location.href = to;
    },
    loadingFallback: () => null,
    tokenCache: "session-storage",
  };
};
