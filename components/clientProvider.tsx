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
    regToast(toast)
  })

  return (
    <>
      {/* <Sidebar
        visible={isSideModalMobileOpen}
        position="left"
        onHide={closeSideModalMobile}
      >
        <ul className="flex flex-col gap-5">
          <li>
            <SubMenuLink url="/" icon_name="Home" title="Профиль" />
          </li>
          <li>
            <SubMenuCollapse title="Маркетинг">
              <SubMenuLink
                url="/marketing/structure"
                icon_name="MultipleUsers"
                title="Маркетинг"
              />
            </SubMenuCollapse>
          </li>
          <li>
            <SubMenuCollapse title="Магазин">
              <SubMenuLink
                url="/catalog"
                icon_name="ShoppingCatalog"
                title="Каталог"
              />
              <SubMenuLink
                url="/order-history"
                icon_name="BaselineHistory"
                title="История заказов"
              />
              <SubMenuLink
                url="/favorite"
                icon_name="Favorite"
                title="Избранное"
              />
            </SubMenuCollapse>
          </li>
          <li>
            <SubMenuCollapse title="Финансы">
              <SubMenuLink
                url="/finance/personal-account"
                icon_name="FinanceManager"
                title="Лицевой счет"
              />
            </SubMenuCollapse>
          </li>
        </ul>
      </Sidebar> */}
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
