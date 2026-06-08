import { create } from "zustand";

interface SideMenuState {
  menuOpen: boolean;
  setMenuOpen: () => void;
  closeMenu: () => void;
}

export const useSideMenu = create<SideMenuState>()((set) => ({
  menuOpen: false,
  setMenuOpen: () =>
    set((state) => ({
      menuOpen: !state.menuOpen,
    })),
  closeMenu: () =>
    set((state) => ({
      menuOpen: false,
    })),
}));
