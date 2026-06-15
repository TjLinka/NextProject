/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { Toast } from "primereact/toast";

export const useModalAndNotify = create()((set, get) => ({
  isSupportModalOpen: false,
  isRefsModalOpen: false,
  toastBlock: null,
  openSupportModal: () => set(() => ({ isSupportModalOpen: true })),
  closeSupportModal: () => set(() => ({ isSupportModalOpen: false })),
  openRefsModal: () => set(() => ({ isRefsModalOpen: true })),
  closeRefsModal: () => set(() => ({ isRefsModalOpen: false })),
  regToast: (elem: any) => set({ toastBlock: elem }),
  showNotification: (severity = "success", detail = "2222", summary = "") => {
    const { toastBlock } = get(); // ← берём toastBlock из стейта
    toastBlock?.current?.show({
      severity: severity,
      summary: summary,
      detail,
      life: 3000,
    });
  },
}));
