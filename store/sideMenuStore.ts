import { create } from "zustand";

interface SideMenuState {
  menuOpen: boolean;
  setMenuOpen: () => void;
}

export const useSideMenu = create<SideMenuState>()((set) => ({
  menuOpen: true,
  setMenuOpen: () =>
    set((state) => ({
      menuOpen: !state.menuOpen,
    })),
}));
