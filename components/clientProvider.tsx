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
import { RefLinksModal } from "./Modals/RefLinksModal";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const toast = useRef<Toast>(null);

  const regToast = useModalAndNotify((state) => state.regToast);

  const isSuppModalOpen = useModalAndNotify(
    (state: any) => state.isSupportModalOpen,
  );
  const closeSupportModal = useModalAndNotify(
    (state: any) => state.closeSupportModal,
  );
  const isRefsModalOpen = useModalAndNotify(
    (state: any) => state.isRefsModalOpen,
  );
  const closeRefsModal = useModalAndNotify(
    (state: any) => state.closeRefsModal,
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
        style={{ width: "40vw" }}
        breakpoints={{ "1024px": "65vw", "641px": "90vw" }}
        onHide={closeSupportModal}
      >
        <SupportModal />
      </Dialog>
      <Dialog
        headerClassName="py-0! py-1! pr-2!"
        visible={isRefsModalOpen}
        draggable={false}
        style={{ width: "fit-content" }}
        breakpoints={{ "641px": "90vw" }}
        onHide={closeRefsModal}
      >
        <RefLinksModal />
      </Dialog>
      <Toast ref={toast} />
    </>
  );
}
