/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useModalAndNotify } from "@/store/modalAndNotify";
import { Dialog } from "primereact/dialog";
import { SupportModal } from "./Modals/SupportModal";

export function ClientWrapper({ children }: { children: React.ReactNode }) {

  const isSuppModalOpen = useModalAndNotify(
    (state : any) => state.isSupportModalOpen,
  );
  const closeSupportModal = useModalAndNotify(
    (state: any) => state.closeSupportModal,
  );

  return (
    <>
      <div>{children}</div>
      <Dialog
        header="Поддержка"
        visible={isSuppModalOpen}
        draggable={false}
        style={{ width: "50vw" }}
        onHide={closeSupportModal}
      >
        <SupportModal/>
      </Dialog>
    </>
  );
}
