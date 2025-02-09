import { create } from "zustand";

export interface UIState {
  isSearchDrawerOpen: boolean;
  toggleSearchDrawer: () => void;
  isCategoriesDrawerOpen: boolean;
  toggleCategoriesDrawer: () => void;
  isProductsFilterDrawerOpen: boolean;
  toggleProductsFilterDrawer: () => void;
  isProductsSortDrawerOpen: boolean;
  toggleProductsSortDrawer: () => void;
}

export const useStore = create<UIState>((set) => ({
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
