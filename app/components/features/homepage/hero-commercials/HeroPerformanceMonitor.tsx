"use client";

import { useEffect } from "react";

export default function HeroPerformanceMonitor() {
  useEffect(() => {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            console.log("LCP:", entry.startTime, "ms");

            if (entry.element) {
              const element = entry.element as HTMLElement;
              if (element.classList.contains("hero-image")) {
                console.log("Hero image is the LCP element");
              }
            }
          }
        }
      });

      observer.observe({ entryTypes: ["largest-contentful-paint"] });

      return () => observer.disconnect();
    }
  }, []);

  return null;
}
