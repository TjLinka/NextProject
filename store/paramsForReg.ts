import { create } from "zustand";
import { persist } from "zustand/middleware";

type Params = {
  aid: string
  t: string
}

interface CartState {
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  params: Params;
  setParams: (params: Params) => void;
}

export const useParamsForReg = create<CartState>()(
  persist(
    (set) => ({
      params: {
        aid: "",
        t: "",
      },
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setParams: (params: { aid: string; t: string }) => {
        set(() => ({
          params: {
            aid: params.aid,
            t: params.t,
          },
        }));
      },
    }),
    {
      name: "param-for-reg",
      partialize: (state) => ({ params: state.params }), // ← hasHydrated не пишем в localStorage
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // ← после загрузки из localStorage ставим флаг
      },
    },
  ),
);
