import { create } from "zustand";

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
  addItem: (item: Omit<BasketItem, "quantity">) => void;
  removeItem: (id: string) => void;
}

export const useStore = create<UIState>((set, get) => ({
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
}));
