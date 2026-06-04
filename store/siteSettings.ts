import { create } from "zustand";

export const useSiteSettings = create()((set) => ({
  mainColor: "#9a56ff",
  setColor: (color: string) => {
    const root = document.documentElement;
    const mainColor = getComputedStyle(root);
    root.style.setProperty("--main-color", color);
    set(() => ({
      mainColor: color,
    }));
  },
}));
