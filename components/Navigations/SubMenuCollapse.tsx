/* eslint-disable @next/next/no-img-element */
"use client";

import { useSideMenu } from "@/store/sideMenuStore";
import clsx from "clsx";
import { useState } from "react";

export const SubMenuCollapse = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  const menuOpen = useSideMenu((state) => state.menuOpen);
  const menuOpenHandler = useSideMenu((state) => state.setMenuOpen)
  const [subMenuOpen, setSubMenuOpen] = useState<boolean>(false);
  const handleSubMenuOpen = () => {
    if (!menuOpen) {
      menuOpenHandler()
      setSubMenuOpen(true)
    } else {
      setSubMenuOpen(!subMenuOpen)
    }
  }
  return (
    <div className="cursor-pointer">
      <div
        className="flex justify-between items-center hover:bg-[#bf94ff59] py-1 px-2 rounded"
        onClick={handleSubMenuOpen}
      >
        <div className="flex gap-4">
          <img src="/icons/BagShopping.svg" alt="" className="w-7 h-7" />
          <span
            className={`transition-opacity duration-200 ${menuOpen ? "opacity-100" : "opacity-0"} text-lg`}
          >
            {title}
          </span>
        </div>
        <img
          src="/icons/Arrow.svg"
          alt="arrow icon"
          className={clsx(
            "w-4 h-4 rotate-180 transition-[rotate] duration-200",
            {
              "rotate-0!": subMenuOpen && menuOpen,
            },
          )}
        />
      </div>
      <div
        className={` ${subMenuOpen && menuOpen ? "max-h-50 mt-5 opacity-100" : "max-h-0 mt-0 opacity-0"} overflow-hidden transition-all duration-200 ease-in-out ml-5 flex flex-col justify-around gap-5`}
      >
        {children}
      </div>
    </div>
  );
};
