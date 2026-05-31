import { Product } from "@/app/(shop)/catalog/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  cart: Product[];
  addToCart: (p: Product) => void;
  removeFromCart: (p: string | number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],

      addToCart: (p) =>
        set((state) => {
            if (state.cart.find((prod) => prod.id === p.id)) return {
                cart: state.cart
            }
          return {
            cart: [...state.cart, p],
          };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((prod) => prod.id !== id),
        })),
    }),
    {
      name: "cart-storage",
    },
  ),
);
