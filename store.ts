import { create } from "zustand";
import { Category } from "@/sanity.types";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";

export interface UIState {
  isSearchDrawerOpen: boolean;
  toggleSearchDrawer: () => void;
  isCategoriesDrawerOpen: boolean;
  toggleCategoriesDrawer: () => void;
  categories: Category[] | null;
  isLoadingCategories: boolean;
  fetchCategories: () => Promise<void>;
}

export const useStore = create<UIState>((set) => ({
  isSearchDrawerOpen: false,
  toggleSearchDrawer: () =>
    set((state) => ({ isSearchDrawerOpen: !state.isSearchDrawerOpen })),

  isCategoriesDrawerOpen: false,
  toggleCategoriesDrawer: () =>
    set((state) => ({ isCategoriesDrawerOpen: !state.isCategoriesDrawerOpen })),

  categories: null,
  isLoadingCategories: false,
  fetchCategories: async () => {
    const { categories, isLoadingCategories } = get();

    if (categories || isLoadingCategories) return;

    set({ isLoadingCategories: true });

    try {
      const fetchedCategories = await getAllCategories();
      set({ categories: fetchedCategories });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      set({ isLoadingCategories: false });
    }
  },
}));
