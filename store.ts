import { create } from "zustand";

export interface UIState {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}

export const useStore = create<UIState>((set) => ({
  isDrawerOpen: false,
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
}));

export const useToggleDrawer = () => useStore((state) => state.toggleDrawer);
