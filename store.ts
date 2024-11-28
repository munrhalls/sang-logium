import { create } from "zustand";

export interface UIState {
  isSearchDrawerOpen: boolean;
  toggleSearchDrawer: () => void;
}

export const useStore = create<UIState>((set) => ({
  isSearchDrawerOpen: false,
  toggleSearchDrawer: () =>
    set((state) => ({ isSearchDrawerOpen: !state.isSearchDrawerOpen })),
}));

export const usetoggleSearchDrawer = () =>
  useStore((state) => state.toggleSearchDrawer);
