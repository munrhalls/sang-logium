"use client";
import React from "react";
import { useBasketStore } from "@/store";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { ShoppingCart, ShoppingBag } from "lucide-react";

export interface BasketProduct {
  _id: string;
  name: string;
  stock: number;
  price: number;
}

// problem: this component re-used means it rerenders as many times as there are re-used components anytime user clicks a button
// goal: only clicked component re-renders
// solution:
// need to have a wrapper with local state for the purpose of de-activating (by default) the basket controls
// this way, only the basket controls that are active are re-rendered on button click
// when the store changed, all the other basket controls are not even rendered, so they don't re-render

const BasketControls = React.memo(
  ({ product }: { product: BasketProduct }) => {
    const _hasHydrated = useBasketStore((s) => s._hasHydrated);
    console.log("🎯 BasketControls _hasHydrated:", _hasHydrated);

    const _id = product._id;
    const basket = useBasketStore((s) => s.basket);
    const addItem = useBasketStore((s) => s.addItem);
    const updateQuantity = useBasketStore((s) => s.updateQuantity);
    const removeItem = useBasketStore((s) => s.removeItem);
    const item = basket.find((i) => i._id === _id);

    if (!item) {
      console.log(product.stock, "product.stock");
      const basketItem = {
        _id: product._id,
        stock: product.stock,
        name: product.name,
        price: product.price,
        quantity: 1,
      };
      return (
        <div
          className="flex justify-start items-center gap-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(basketItem);
            }}
            aria-label="Add to Cart"
            className="rounded-lg bg-black text-black p-2 h-14 w-14 flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <span
              className="p-1"
              style={{ display: "inline-flex", lineHeight: 0 }}
            >
              <ShoppingCart className="w-8 h-8 text-white" />
            </span>
          </button>
          <span className="text-black text-xl font-black border-dashed border-black mb-[1px]">
            Add to cart
          </span>
        </div>
      );
    }

    const canIncrement = item.quantity < product.stock;
    console.log("🎯 BasketControls canIncrement:", product.stock);

    const handleDecrement = (e: React.MouseEvent) => {
      if (item.quantity === 1) {
        removeItem(_id);
      } else {
        updateQuantity(_id, item.quantity - 1);
      }
    };

    const handleRemove = (e: React.MouseEvent) => {
      removeItem(_id);
    };

    const handleIncrement = (e: React.MouseEvent) => {
      if (canIncrement) {
        updateQuantity(_id, item.quantity + 1);
      }
    };

    return (
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="font-bold text-lg">Purchase quantity:</div>
        <div className="flex items-center gap-x-2">
          <button
            aria-label="Increase quantity"
            onClick={handleIncrement}
            disabled={!canIncrement}
            className="bg-black text-white rounded p-2 h-9 w-9 flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            +
          </button>

          <span className="font-black w-6 text-center">{item.quantity}</span>
          <button
            aria-label="Decrease quantity"
            onClick={handleDecrement}
            className="bg-black text-white rounded p-2 h-9 w-9 flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            -
          </button>
          <button
            aria-label="Remove from basket"
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 transition-colors rounded p-2 h-9 w-9 flex items-center justify-center"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.product._id === nextProps.product._id;
  }
);

function BasketControlsWrapper({ product }: { product: BasketProduct }) {
  const [active, setActive] = React.useState(false);
  const basket = useBasketStore((s) => s.basket);
  const item = basket.find((i) => i._id === product._id);
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
  return <BasketControls product={product} />;
}

export default BasketControlsWrapper;
