import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Requis = {
  paymentAccount: string;
  fio: string;
  inn: string;
  corAccount: string;
  bik: string;
  address: string;
  bank: string;
  work_type: number;
  ogrn: string;
};

interface SideMenuState {
  requis: Requis;
  setRequis: (data: Requis) => void;
  clearRequis: () => void;
}

const initValue = {
  paymentAccount: "",
  fio: "",
  inn: "",
  corAccount: "",
  bik: "",
  address: "",
  bank: "",
  work_type: 0,
  ogrn: "",
};

export const useRequisStore = create<SideMenuState>()(
  persist((set) => ({
    requis: initValue,
    setRequis: (data: Requis) =>
      set(() => ({
        requis: data,
      })),
    clearRequis: () =>
      set(() => ({
        requis: initValue,
      })),
  }), {
    name: "requis-storage"
  }),
);
