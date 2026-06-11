/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useModalAndNotify } from "@/store/modalAndNotify";
import { Dialog } from "primereact/dialog";
import { SupportModal } from "./Modals/SupportModal";
import { Sidebar } from "primereact/sidebar";
import { SubMenuLink } from "./Navigations/SideMenuLink";
import { SubMenuCollapse } from "./Navigations/SubMenuCollapse";
import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";
import { getFavouritesProducts } from "@/app/(protected)/(shop)/favorite/action";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const toast = useRef<Toast>(null);

  const regToast = useModalAndNotify((state) => state.regToast);

  const isSuppModalOpen = useModalAndNotify(
    (state: any) => state.isSupportModalOpen,
  );
  const closeSupportModal = useModalAndNotify(
    (state: any) => state.closeSupportModal,
  );
  const isSideModalMobileOpen = useModalAndNotify(
    (state: any) => state.isSideModalMobileOpen,
  );
  const closeSideModalMobile = useModalAndNotify(
    (state: any) => state.closeSideModalMobile,
  );

  useEffect(() => {
    regToast(toast);
  });

  return (
    <>
      <div className="h-full">{children}</div>
      <Dialog
        header="Поддержка"
        visible={isSuppModalOpen}
        draggable={false}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        onHide={closeSupportModal}
      >
        <SupportModal />
      </Dialog>
      <Toast ref={toast} />
    </>
  );
}
