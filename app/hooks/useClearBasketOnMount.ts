"use client";

import { useEffect } from "react";
import { useBasketStore } from "@/store/store";

export function useClearBasketOnMount() {
  const clearBasket = useBasketStore((s) => s.clearBasket);

  useEffect(() => {
    clearBasket();
  }, [clearBasket]);
}
