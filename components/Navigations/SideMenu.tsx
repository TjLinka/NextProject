/* eslint-disable @next/next/no-img-element */
"use client";
import { useCartStore } from "@/store/cartStore";
import { useSideMenu } from "@/store/sideMenuStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SubMenuCollapse } from "./SubMenuCollapse";
import { SubMenuLink } from "./SideMenuLink";
import Image from "next/image";
import { useAgentStore } from "@/store/agentStore";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export const SideMenu = ({ className }: { className?: string }) => {
  const router = useRouter();
  const logout = useAgentStore((state) => state.logout);
  const [mounted, setMounted] = useState(false);
  const setSideMenuStore = useSideMenu((state) => state.setMenuOpen);
  const closeMenu = useSideMenu((state) => state.closeMenu);
  const sideMenuStatus = useSideMenu((state) => state.menuOpen);
  const isAuth = useAgentStore((state) => state.isAuth);

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
        `bg-white flex flex-col pb-5 justify-between h-full shrink-0 px-0 ${sideMenuStatus ? "min-w-0 w-75 px-5" : "md:w-21 w-0"} 
        shadow-md transition-[width, opacity] opacity-0 ease-in-out duration-500 overflow-hidden
         h-screen fixed z-100 top-0 ${className}`,
        {
          "md:min-w-10 md:px-5  opacity-100": isAuth && mounted,
          "w-0! px-0 opacity-0": !isAuth && mounted,
        },
      )}
    >
      <div className={`py-5 flex justify-between items-center`}>
        <Link
          href={"/dashboard"}
          className={`flex text-2xl gap-2 items-center cursor-pointer  uppercase text-center transition-opacity duration-400 ${sideMenuStatus ? "opacity-100" : "opacity-0 pointer-events-none cursor-auto"}`}
        >
          <Image
            src={`/imgs/logo_hippo_menu.svg`}
            alt="side menu logo"
            width={200}
            height={200}
            className={`w-10 h-10 ${sideMenuStatus ? "opacity-100" : "opacity-0"} transition-opacity duration-400`}
          />
          <div>
            <span className="font-semibold">GLEB.</span>
            <span className="font-light">TEAM</span>
          </div>
        </Link>
        <div
          className={`w-6 h-6 ${sideMenuStatus ? "rotate-0" : "rotate-180"} cursor-pointer absolute right-7 transition-[rotate] duration-300`}
          onClick={handleMenuOpen}
        >
          <img src="/icons/MenuCollapse.svg" alt="" className="w-full h-full" />
        </div>
      </div>
      <hr className="border-gray-400 mb-5" />
      <ul className="flex flex-col gap-5 grow">
        <li>
          <SubMenuLink url="/" icon_name="Home" title="Профиль" />
        </li>
        <li>
          <SubMenuCollapse title="Маркетинг" icon="MultipleUsers">
            <SubMenuLink
              url="/marketing/structure"
              icon_name="TreeList"
              title="Структура"
            />
            <SubMenuLink
              url="/marketing/binar"
              icon_name="BinaryTree"
              title="Бинар"
            />
          </SubMenuCollapse>
        </li>
        <li>
          <SubMenuCollapse title="Магазин" icon="BagShopping">
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
          <SubMenuCollapse title="Финансы" icon="FinanceMode">
            <SubMenuLink
              url="/finance/personal-account"
              icon_name="FinanceManager"
              title="Лицевой счет"
            />
            <SubMenuLink
              url="/finance/bonus-account"
              icon_name="PiggyBank"
              title="Товарный счет"
            />
            <SubMenuLink
              url="/finance/withdraw"
              icon_name="LowIncomeLevelOutline24px"
              title="История вывода"
            />
          </SubMenuCollapse>
        </li>
        <li>
          <SubMenuLink url="/news" icon_name="News" title="Новости" />
        </li>
        <li>
          <SubMenuLink
            url="/activity"
            icon_name="Activity"
            title="Активность"
          />
        </li>
      </ul>
      <div
        onClick={() => {
          closeMenu();
          logout();
          router.push("/login");
        }}
        className={`whitespace-nowrap flex items-center gap-4 hover:bg-[#bf94ff59] py-1 px-2 rounded cursor-pointer`}
      >
        <div className="w-7 h-7 shrink-0">
          <img src={`/icons/Logout.svg`} alt="" className="w-7 h-7 shrink-0" />
        </div>
        <span
          className={`transition-opacity duration-200 ${sideMenuStatus ? "opacity-100" : "opacity-0"} text-lg`}
        >
          Выйти
        </span>
      </div>
    </div>
  );
};
