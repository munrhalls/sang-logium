import { create } from "zustand";

interface UIState {
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}

const useStore = create<UIState>((set) => ({
  isDrawerOpen: false,
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
}));

export const useToggleDrawer = () => useStore((state) => state.toggleDrawer);

export default useStore;
