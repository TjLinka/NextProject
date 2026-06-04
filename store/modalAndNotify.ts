import { create } from "zustand";

export const useModalAndNotify = create()((set) => ({
  isSupportModalOpen: false,
  openSupportModal: () => set(() => ({ isSupportModalOpen: true })),
  closeSupportModal: () => set(() => ({ isSupportModalOpen: false })),
}));
