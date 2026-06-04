/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useSideMenu } from "@/store/sideMenuStore";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";
import clsx from "clsx";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Button } from "@/components/UI/Button";
import { useQuery } from "@tanstack/react-query";
import { getShopCatalog } from "../actions";

export const ShopCatalogClient = ({
  catagoryes,
}: {
  data?: Product[];
  catagoryes: any;
}) => {
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const sideMenuOpen = useSideMenu((state) => state.menuOpen);
  const [showFilter, setShowFilters] = useState<boolean>(false);

  const { data } = useQuery<Product[]>({
    queryKey: ["catalog", search],
    queryFn: () => getShopCatalog(search),
  });

  return (
    <div>
      <div className="grid grid-cols-5 gap-5 items-stretch">
        <div
          className="flex shrink-0 justify-center items-center text-white gap-2 px-4 rounded-lg cursor-pointer bg-(--main-color)"
          onClick={() => {
            setShowFilters(!showFilter);
          }}
        >
          <img src="/icons/Filters.svg" alt="" className="w-7" />
          <span className="text-lg">Фильтры</span>
        </div>
        <div className="w-full flex justify-center items-center gap-2 col-span-4">
          <InputText
            value={searchInput}
            className="w-full"
            placeholder="Поиск по названию"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchInput(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") setSearch(searchInput);
            }}
          />
          <Button className="h-full" onClick={() => setSearch(searchInput)}>
            Найти
          </Button>
        </div>
      </div>
      <div className="flex gap-5 items-start mt-5">
        {showFilter && (
          <div className="bg-white p-4 shadow max-w-70 w-full shrink-0 rounded-lg sticky top-5">
            <p className="text-lg font-semibold">Фильтры</p>
          </div>
        )}
        <div
          className={clsx("grid grid-cols-4 gap-5", {
            "grid-cols-3!": showFilter,
          })}
        >
          {data?.map((p) => {
            return <ProductCard key={p.id} product={p} />;
          })}
        </div>
      </div>
    </div>
  );
};
