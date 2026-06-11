/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useModalAndNotify } from "@/store/modalAndNotify";
import { useSideMenu } from "@/store/sideMenuStore";
import { useWindowSize } from "@reactuses/core";
import Link from "next/link";

export const SubMenuLink = ({
  url,
  icon_name,
  title,
  className,
}: {
  url?: string;
  icon_name: string;
  title: string;
  className?: string
}) => {
  const setSideMenuStore = useSideMenu((state) => state.setMenuOpen);
  const menuOpen = useSideMenu((state) => state.menuOpen);
  const {width, height} = useWindowSize()
  const closeSideMobileMenu = useModalAndNotify(
    (state :any) => state.closeSideModalMobile,
  );

  return (
    <Link
      href={`${url}`}
      onClick={() => {
        if (width < 700 || menuOpen) setSideMenuStore();
      }}
      className={`whitespace-nowrap flex items-center gap-4 hover:bg-[#bf94ff59] py-1 px-2 rounded ${className}`}
    >
      <div className="w-7 h-7 shrink-0">
        <img
          src={`/icons/${icon_name}.svg`}
          alt=""
          className="w-7 h-7 shrink-0"
        />
      </div>
      <span
        className={`transition-opacity duration-200 ${menuOpen ? "opacity-100" : "opacity-0"} text-lg`}
      >
        {title}
      </span>
    </Link>
  );
};
