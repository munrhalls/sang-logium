import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BasketItem {
  id: string;
  name: string;
  price: number;
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
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
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
      addItem: (item) => {
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
      },
      removeItem: (id) => {
        const basket = get().basket;
        set({ basket: basket.filter((i) => i.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        const basket = get().basket;
        set({
          basket: basket.map((i) =>
            i.id === id ? { ...i, quantity: quantity < 1 ? 1 : quantity } : i
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
    }
  )
);
