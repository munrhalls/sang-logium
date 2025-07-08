import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BasketItem {
  _id: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
}

interface UIState {
  isSearchDrawerOpen: boolean;
  toggleSearchDrawer: () => void;
  isCategoriesDrawerOpen: boolean;
  toggleCategoriesDrawer: () => void;
  isProductsFilterDrawerOpen: boolean;
  toggleProductsFilterDrawer: () => void;
  isProductsSortDrawerOpen: boolean;
  toggleProductsSortDrawer: () => void;
}

interface BasketState {
  basket: BasketItem[];
  _hasHydrated: boolean;
  addItem: (item: BasketItem) => void;
  removeItem: (_id: string) => void;
  updateQuantity: (_id: string, quantity: number) => void;
  getTotal: () => number;
  isCheckoutEnabled: () => boolean;
}

export const useUIStore = create<UIState>((set) => ({
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
}));

export const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      basket: [],
      _hasHydrated: false,
      addItem: (item) => {
        if (
          !item ||
          typeof item !== "object" ||
          !item._id ||
          !item.name ||
          typeof item.price !== "number"
        ) {
          return;
        }

        const basket = get().basket;
        const existing = basket.find((i) => i._id === item._id);
        if (existing) {
          set({
            basket: basket.map((i) =>
              i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          });
        } else {
          set({ basket: [...basket, { ...item, quantity: 1 }] });
        }
      },
      removeItem: (_id) => {
        const basket = get().basket;
        set({ basket: basket.filter((i) => i._id !== _id) });
      },
      updateQuantity: (_id, quantity) => {
        const basket = get().basket;
        set({
          basket: basket.map((i) =>
            i._id === _id ? { ...i, quantity: quantity < 1 ? 1 : quantity } : i,
          ),
        });
      },
      getTotal: () => {
        const basket = get().basket;
        const total = basket.reduce((sum, i) => sum + i.price * i.quantity, 0);
        return total;
      },
      isCheckoutEnabled: () => {
        const basket = get().basket;
        const enabled = basket.length > 0;
        return enabled;
      },
    }),
    {
      name: "basket-storage",
      partialize: (state) => ({ basket: state.basket }),
      onRehydrateStorage: () => {
        // ADD THIS WHOLE BLOCK
        console.log("🔄 Starting rehydration...");
        return () => {
          console.log("✅ Rehydration complete!");
          // state?._hasHydrated = true;
        };
      },
    },
  ),
);
