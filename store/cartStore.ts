import { Product } from "@/app/(protected)/(shop)/catalog/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  cart: Product[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addToCart: (p: Product) => void;
  removeFromCart: (p: string | number) => void;
  incrCount: (id: number) => void;
  decrCount: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      addToCart: (p) =>
        set((state) => {
          if (state.cart.find((prod) => prod.id === p.id))
            return { cart: state.cart };
          p.count = 1;
          return { cart: [...state.cart, p] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((prod) => prod.id !== id),
        })),
      incrCount: (id) =>
        set((state) => ({
          cart: state.cart.map((product) =>
            product.id === id && !(product.count + 1 > product.webreg)
              ? { ...product, count: product.count + 1 }
              : product,
          ),
        })),
      decrCount: (id) =>
        set((state) => ({
          cart: state.cart.map((product) =>
            product.id === id && product.count > 1
              ? { ...product, count: product.count - 1 }
              : product,
          ),
        })),
      clearCart: () => set(() => ({ cart: [] })),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cart: state.cart }), // ← hasHydrated не пишем в localStorage
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // ← после загрузки из localStorage ставим флаг
      },
    },
  ),
);
