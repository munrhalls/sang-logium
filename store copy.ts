import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BasketItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface UIState {
  isSearchDrawerOpen: boolean;
  toggleSearchDrawer: () => void;
  isCategoriesDrawerOpen: boolean;
  toggleCategoriesDrawer: () => void;
  isProductsFilterDrawerOpen: boolean;
  toggleProductsFilterDrawer: () => void;
  isProductsSortDrawerOpen: boolean;
  toggleProductsSortDrawer: () => void;
  basket: BasketItem[];
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getTotal: () => number;
  isCheckoutEnabled: () => boolean;
}

export const useStore = create<UIState>()(
  persist(
    (set, get) => ({
      isSearchDrawerOpen: false,
      toggleSearchDrawer: () =>
        set((state) => ({
          isSearchDrawerOpen: !state.isSearchDrawerOpen,
          isCategoriesDrawerOpen: false,
        })),
      isCategoriesDrawerOpen: false,
      toggleCategoriesDrawer: () =>
        set((state) => ({
          isCategoriesDrawerOpen: !state.isCategoriesDrawerOpen,
          isSearchDrawerOpen: false,
        })),
      isProductsFilterDrawerOpen: false,
      toggleProductsFilterDrawer: () =>
        set((state) => ({
          isProductsFilterDrawerOpen: !state.isProductsFilterDrawerOpen,
          isProductsSortDrawerOpen: false,
        })),
      isProductsSortDrawerOpen: false,
      toggleProductsSortDrawer: () =>
        set((state) => ({
          isProductsSortDrawerOpen: !state.isProductsSortDrawerOpen,
          isProductsFilterDrawerOpen: false,
        })),
      basket: [],
      addItem: (item) => {
        console.log("[Zustand] addItem called", item);
        if (
          !item ||
          typeof item !== "object" ||
          !item.id ||
          !item.name ||
          typeof item.price !== "number"
        ) {
          return;
        }

        const basket = get().basket;
        const existing = basket.find((i) => i.id === item.id);
        if (existing) {
          set({
            basket: basket.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ basket: [...basket, { ...item, quantity: 1 }] });
        }
        console.log("[Zustand] basket after addItem", get().basket);
      },
      removeItem: (id) => {
        console.log("[Zustand] removeItem called", id);
        const basket = get().basket;
        set({ basket: basket.filter((i) => i.id !== id) });
        console.log("[Zustand] basket after removeItem", get().basket);
      },
      updateQuantity: (id, quantity) => {
        console.log("[Zustand] updateQuantity called", { id, quantity });
        const basket = get().basket;
        set({
          basket: basket.map((i) =>
            i.id === id ? { ...i, quantity: quantity < 1 ? 1 : quantity } : i
          ),
        });
        console.log("[Zustand] basket after updateQuantity", get().basket);
      },
      getTotal: () => {
        const basket = get().basket;
        const total = basket.reduce((sum, i) => sum + i.price * i.quantity, 0);
        console.log("[Zustand] getTotal called", total);
        return total;
      },
      isCheckoutEnabled: () => {
        const basket = get().basket;
        const enabled = basket.length > 0;
        console.log("[Zustand] isCheckoutEnabled called", enabled);
        return enabled;
      },
    }),
    {
      name: "basket-storage",
      partialize: (state) => ({ basket: state.basket }),
    }
  )
);
