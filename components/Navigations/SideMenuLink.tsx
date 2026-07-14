/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useModalAndNotify } from "@/store/modalAndNotify";
import { useSideMenu } from "@/store/sideMenuStore";
import { useWindowSize } from "@reactuses/core";
import clsx from "clsx";
import Link from "next/link";

export const SubMenuLink = ({
  url,
  icon_name,
  title,
  className,
  lvl,
}: {
  url?: string;
  icon_name: string;
  title: string;
  className?: string
  lvl?: string
}) => {
  const setSideMenuStore = useSideMenu((state) => state.setMenuOpen);
  const menuOpen = useSideMenu((state) => state.menuOpen);
  const {width, height} = useWindowSize()

  return (
    <Link
      href={`${url}`}
      onClick={() => {
        if (width < 700 || menuOpen) setSideMenuStore();
      }}
      className={`whitespace-nowrap flex items-center gap-4 hover:bg-(--body-color) py-1 px-2 rounded ${className}`}
    >
      {icon_name && (
        <div className="md:w-7 md:h-7 shrink-0">
          <img
            src={`/icons/${icon_name}.svg`}
            alt=""
            className="md:w-7 w-5 md:h-7 h-5 shrink-0"
          />
        </div>
      )}
      <p
        className={clsx(
          `transition-opacity duration-200 ${menuOpen ? "opacity-100" : "opacity-0"} md:text-lg text-sm font-medium`,
          {
            "text-sm": lvl === "1",
          },
        )}
      >
        {title}
      </p>
    </Link>
  );
};
