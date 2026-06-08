/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAgentStore } from "@/store/agentStore";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Button } from "../UI/Button";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { HeaderProductCard } from "@/app/(protected)/(shop)/catalog/components/HeaderProductCard";
import { useRouter } from "next/navigation";
import { useModalAndNotify } from "@/store/modalAndNotify";
import { useWindowSize } from "@reactuses/core";
import { InputText } from "primereact/inputtext";
import { usePathname } from "next/navigation";
import { useSideMenu } from "@/store/sideMenuStore";

export const Header = () => {
  const openSuppModal = useModalAndNotify(
    (state: any) => state.openSupportModal,
  );

  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const setSideMenuStore = useSideMenu((state) => state.setMenuOpen);
  const sideMenuStatus = useSideMenu((state) => state.menuOpen);
  const [headerSearch, setheaderSearch] = useState<string>("");
  const user = useAgentStore((state) => state.agentInfo);
  const cartLength = useCartStore((state) => state.cart.length);
  const cart = useCartStore((state) => state.cart);
  const isAuth = useAgentStore((state) => state.isAuth);
  const logout = useAgentStore((state) => state.logout);

  const { width, height } = useWindowSize();

  const router = useRouter();

  // const isSideModalMobileOpen = useModalAndNotify(
  //   (state: any) => state.isSideModalMobileOpen,
  // );
  const openSideModalMobile = useModalAndNotify(
    (state: any) => state.openSideModalMobile,
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleSearchInCatalog = () => {
    router.push(`/catalog?find=${headerSearch}`);
    setheaderSearch("");
  };

  if (!mounted) return null;
  return (
    <header
      className={clsx(
        "h-0 bg-white shadow flex opacity-0 transition-[height, opacity] duration-500 justify-end items-center px-0 sticky top-0 z-20",
        {
          "h-20! md:px-7! px-3 md:pl-30! opacity-100!": isAuth && mounted,
        },
      )}
    >
      <div className={clsx("")}>
        <Image
          onClick={setSideMenuStore}
          src="/icons/MenuCollapse.svg"
          alt="Menu Icon"
          width={100}
          height={100}
          className="w-7 h-7 rotate-180 cursor-pointer md:hidden block"
        />
      </div>
      <Link
        href={"/dashboard"}
        className={` text-2xl md:flex hidden gap-2 items-center cursor-pointer  uppercase text-center transition-opacity duration-400 ${!sideMenuStatus ? "opacity-100" : "opacity-0"}`}
      >
        <Image
          src={`/imgs/logo_hippo_menu.svg`}
          alt="side menu logo"
          width={200}
          height={200}
          className={`w-10 h-10 ${!sideMenuStatus ? "opacity-100" : "opacity-0"} transition-opacity duration-400`}
        />
        <div>
          <span className="font-semibold">GLEB.</span>
          <span className="font-light">TEAM</span>
        </div>
      </Link>
      <div className="flex items-center justify-end gap-5 grow">
        {!(pathname === "/catalog") && (
          <InputText
            value={headerSearch}
            className="w-1/3 md:block hidden"
            placeholder="Поиск в каталоге"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setheaderSearch(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") handleSearchInCatalog();
            }}
          />
        )}
        <Link href={"/refs-link"} className="mb:block hidden">
          <Button>Пригласить партнёра</Button>
        </Link>
        <Image
          alt="Support Icon"
          src={`/icons/Support.svg`}
          width={200}
          height={200}
          className="w-7 h-7 cursor-pointer"
          onClick={openSuppModal}
        />
        <div className="relative cart_icon">
          <div
            className="relative"
            onClick={() => {
              router.push("/cart");
            }}
          >
            <Image
              src={"/icons/Cart.svg"}
              width={200}
              height={200}
              alt="Cart Icon"
              className="w-7 h-7 cursor-pointer"
            />
            {cartLength > 0 && (
              <span className=" absolute top-0 -right-1 w-4 h-4 text-xs bg-(--main-color) text-white rounded-full flex justify-center items-center">
                {cartLength}
              </span>
            )}
          </div>
          <div
            className={clsx(
              `bg-white w-100 max-h-100 h-fit top-7 -left-90 shadow-md rounded-xl border overflow-y-auto border-gray-300 absolute ${width > 700 && cartLength ? "hidden" : "hidden!"} cart_header z-20`,
            )}
          >
            {cart.map((p) => {
              return <HeaderProductCard product={p} key={p.id} />;
            })}
          </div>
        </div>
        <Button className="mb:block hidden">Пригласить партнёра</Button>
        <Link href={"/"}>
          <div className="flex gap-2 items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              {user.avatar && (
                <Image
                  src={user?.avatar}
                  alt=""
                  width={200}
                  height={200}
                  className="w-full h-full"
                />
              )}
            </div>
            <span className="font-semibold cursor-pointer md:block hidden">
              {user.name}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};
