/* eslint-disable @next/next/no-img-element */
"use client";
import { useCartStore } from "@/store/cartStore";
import { useSideMenu } from "@/store/sideMenuStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SubMenuCollapse } from "./SubMenuCollapse";
import { SubMenuLink } from "./SideMenuLink";
import { Button } from "primereact/button";
import Image from "next/image";
import { useAgentStore } from "@/store/agentStore";
import clsx from "clsx";

export const SideMenu = () => {
  const [mounted, setMounted] = useState(false);
  const setSideMenuStore = useSideMenu((state) => state.setMenuOpen);
  const sideMenuStatus = useSideMenu((state) => state.menuOpen);
  const isAuth = useAgentStore((state) => state.isAuth);
  // const [sideMenuStatus, setMenuOpen] = useState<boolean>(sideMenuStatus);
  const cartLength = useCartStore((state) => state.cart.length);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleMenuOpen = () => {
    setSideMenuStore();
  };
  if (!mounted) return null;
  return (
    <div
      className={clsx(
        `bg-white shrink-0 px-0 ${sideMenuStatus ? "min-w-0 w-75" : "w-21"} shadow-md transition-[width, opacity] opacity-0 ease-in-out duration-500 overflow-hidden h-screen sticky top-0`,
        {
          "min-w-10 px-5 opacity-100": isAuth && mounted,
          "w-0! px-0 opacity-0": !isAuth && mounted,
        },
      )}
    >
      <div className={`py-5 flex justify-between items-center`}>
        <div
          className={`flex text-2xl gap-2 items-center  uppercase text-center transition-opacity duration-200 ${sideMenuStatus ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={`/imgs/logo_hippo_menu.svg`}
            alt="side menu logo"
            width={200}
            height={200}
            className="w-10 h-10"
          />
          <div>
            <span className="font-semibold">GLEB.</span>
            <span className="font-light">TEAM</span>
          </div>
        </div>
        <div
          className={`w-6 h-6 ${sideMenuStatus ? "rotate-0" : "rotate-180"} cursor-pointer absolute right-7 transition-[rotate] duration-300`}
          onClick={handleMenuOpen}
        >
          <img src="/icons/MenuCollapse.svg" alt="" className="w-full h-full" />
        </div>
      </div>
      <hr className="border-gray-400 mb-5" />
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
    </div>
  );
};
