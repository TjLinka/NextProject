/* eslint-disable @next/next/no-img-element */
"use client";
import { useCartStore } from "@/store/cartStore";
import { useSideMenu } from "@/store/sideMenuStore";
import Link from "next/link";
import { useState } from "react";
import { SubMenuCollapse } from "./SubMenuCollapse";
import { SubMenuLink } from "./SideMenuLink";
import { Button } from "primereact/button";
import Image from "next/image";

export const SideMenu = () => {
  const setSideMenuStore = useSideMenu((state) => state.setMenuOpen);
  const sideMenuStatus = useSideMenu((state) => state.menuOpen) 

  // const [sideMenuStatus, setMenuOpen] = useState<boolean>(sideMenuStatus);
  const cartLength = useCartStore((state) => state.cart.length);

  const handleMenuOpen = () => {
    setSideMenuStore();
  };

  return (
    <div
      className={`bg-white shrink-0 px-5 ${sideMenuStatus ? "min-w-10 w-75" : "w-21"} shadow-md transition-[width] ease-in-out duration-300 overflow-hidden h-screen sticky top-0`}
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
          <SubMenuLink url="/" icon_name="Home" title="Главная" />
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
        {/* <li>
          <Link
            href={`/shop/cart`}
            className={`whitespace-nowrap flex justify-between items-center gap-4`}
          >
            <div className="flex gap-4">
              <div className="relative w-7 h-7">
                <img src="/icons/Cart.svg" alt="" className="w-7 h-7" />
                {cartLength > 0 && !sideMenuStatus && (
                  <span
                    className={`bg-[#bf94ff] rounded-full text-white flex absolute top-0 -right-2 justify-center items-center w-4 h-4 text-sm`}
                  >
                    {cartLength}
                  </span>
                )}
              </div>
              <span
                className={`transition-opacity duration-200 ${sideMenuStatus ? "opacity-100" : "opacity-0"} text-lg`}
              >
                Корзина
              </span>
            </div>
            {cartLength > 0 && (
              <span
                className={`bg-[#bf94ff] rounded-full text-white flex justify-center items-center w-5 h-5 text-sm`}
              >
                {cartLength}
              </span>
            )}
          </Link>
        </li> */}
      </ul>
    </div>
  );
};
