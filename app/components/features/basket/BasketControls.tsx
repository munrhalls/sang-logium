"use client";
import React from "react";
import { useBasketStore } from "@/store";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { ShoppingCart, ShoppingBag } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import BasketControlsButtons from "./BasketControlsButtons";
export interface BasketProduct {
  _id: string;
  name: string;
  stock: number;
  price: number;
}

function BasketControls({ product }: { product: BasketProduct }) {
  console.log("basket controls container");
  const [active, setActive] = React.useState(false);
  const item = useBasketStore((s) =>
    s.basket.find((i) => i._id === product._id)
  );
  React.useEffect(() => {
    if (!item) setActive(false);
  }, [item]);

  if (!active) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setActive(true);
        }}
        aria-label="Show Basket Controls"
        className="rounded-lg bg-black text-black p-2 h-14 w-14 flex items-center justify-center hover:bg-gray-800 transition-colors"
      >
        <span className="p-1" style={{ display: "inline-flex", lineHeight: 0 }}>
          <ShoppingCart className="w-8 h-8 text-white" />
        </span>
      </button>
    );
  }
  return <BasketControlsButtons product={product} />;
}

export default BasketControls;
