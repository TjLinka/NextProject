/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useSideMenu } from "@/store/sideMenuStore";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";
import clsx from "clsx";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

export const ShopCatalogClient = ({
  data,
  catagoryes,
}: {
  data: Product[];
  catagoryes: any;
}) => {
  const sideMenuOpen = useSideMenu((state) => state.menuOpen)
  const [showFilter, setShowFilters] = useState<boolean>(false)
  return (
    <div>
      <div className="grid grid-cols-5 gap-5 items-stretch">
        <div className="flex shrink-0 justify-center items-center text-white gap-2 px-4 rounded-lg cursor-pointer bg-[#bf94ff]" onClick={() => {
          setShowFilters(!showFilter)
        }}>
          <img src="/icons/Filters.svg" alt="" className="w-7" />
          <span className="text-lg font-semibold">Фильтры</span>
        </div>
        <div className="w-full col-span-4">
          <InputText className="w-full" placeholder="Поиск по названию"/>
        </div>
      </div>
      <div className="flex gap-5 items-start mt-5">
        {showFilter &&  <div className="bg-white p-4 shadow max-w-70 w-full shrink-0 rounded-lg sticky top-5">
          <p className="text-lg font-semibold">Фильтры</p>
        </div>}
        <div className={clsx('grid grid-cols-5 gap-5', {
          'grid-cols-4!': (sideMenuOpen && !showFilter) || (!sideMenuOpen && showFilter),
          'grid-cols-3!': sideMenuOpen && showFilter
        })}>  
          {data.map((p) => {
            return <ProductCard key={p.id} product={p} />;
          })}
        </div>
      </div>
    </div>
  );
};
