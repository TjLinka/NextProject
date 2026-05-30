/* eslint-disable @next/next/no-img-element */
"use client";
import { useSideMenu } from "@/store/sideMenuStore";
import Link from "next/link";

export const SubMenuLink = ({
  url,
  icon_name,
  title,
}: {
  url: string;
  icon_name: string;
  title: string;
}) => {
  const menuOpen = useSideMenu((state) => state.menuOpen);

  return (
    <Link
      href={`${url}`}
      className={`whitespace-nowrap flex items-center gap-4 hover:bg-[#bf94ff59] py-1 px-2 rounded`}
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
