"use client";

import { useEffect } from "react";
import { useBasketStore } from "@/store/store";

export function OrderSuccessClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const clearBasket = useBasketStore((s) => s.clearBasket);

  useEffect(() => {
    clearBasket();
  }, [clearBasket]);

  return <>{children}</>;
}
