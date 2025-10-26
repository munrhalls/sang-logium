import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BasketItem {
  _id: string;
  name: string;
  stripePriceId: string;
  displayPrice: number;
  stock: number;
  quantity: number;
  description: string;
  image: string;
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
  clearBasket: () => void;
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
          typeof item.displayPrice !== "number" ||
          typeof item.stock !== "number"
        ) {
          return;
        }
        const basket = get().basket;
        const existing = basket.find((i) => i._id === item._id);
        if (existing) {
          if (existing.quantity < existing.stock) {
            set({
              basket: basket.map((i) =>
                i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            });
          }
        } else {
          const initialQuantity = Math.min(1, item.stock);
          if (initialQuantity > 0) {
            set({
              basket: [...basket, { ...item, quantity: initialQuantity }],
            });
          }
        }
      },
      removeItem: (_id) => {
        const basket = get().basket;
        set({ basket: basket.filter((i) => i._id !== _id) });
      },
      updateQuantity: (_id, quantity) => {
        const basket = get().basket;
        set({
          basket: basket.map((i) => {
            if (i._id === _id) {
              let safeQuantity = Math.max(1, quantity);
              safeQuantity = Math.min(safeQuantity, i.stock);
              return { ...i, quantity: safeQuantity };
            }
            return i;
          }),
        });
      },
      getTotal: () => {
        const basket = get().basket;
        const total = basket.reduce(
          (sum, i) => sum + i.displayPrice * i.quantity,
          0
        );
        return total;
      },
      isCheckoutEnabled: () => {
        const basket = get().basket;
        const hasValidItems = basket.every(
          (i) => i.quantity > 0 && i.stock > 0
        );
        return basket.length > 0 && hasValidItems;
      },
      clearBasket: () => set({ basket: [] }),
    }),
    {
      name: "basket-storage",
      partialize: (state) => ({ basket: state.basket }),
      onRehydrateStorage: () => {
        return () => {
          console.log("✅ Rehydration complete!");
        };
      },
    }
  )
);
