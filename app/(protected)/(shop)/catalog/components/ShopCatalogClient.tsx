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
import { getCatalog } from "@/dbQuery/dbQuerys";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Collapse } from "@/components/UI/Collapse";

export const ShopCatalogClient = ({
  catagoryes,
}: {
  data?: Product[];
  catagoryes: [];
}) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("find") ?? "";
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchInput, setSearchInput] = useState(search);
  const [showFilter, setShowFilters] = useState<boolean>(false);
  const router = useRouter();

  const { data } = useQuery<Product[]>({
    queryKey: ["catalog", search, selectedCategory],
    queryFn: () => getCatalog(search, selectedCategory),
  });

  console.log(catagoryes);
  

  const handleSearch = () => {
    if (searchInput) router.push(`/catalog/?find=${searchInput}`);
    else router.push(`/catalog`);
  };

  const resetFilters = () => {
    router.push(`/catalog`);
    setSelectedCategory(null)
    setSearchInput('')
  }

  return (
    <div>
      <div className="grid grid-cols-5 md:gap-5 gap-2 items-stretch">
        <div
          className="flex shrink-0 justify-center items-center text-white gap-2 px-4 rounded-lg cursor-pointer bg-(--main-color)"
          onClick={() => setShowFilters(!showFilter)}
        >
          <Image
            src="/icons/Filters.svg"
            alt="Filters"
            width={200}
            height={200}
            className="w-7"
          />
          <span className="text-lg md:inline hidden">Фильтры</span>
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
              if (e.key === "Enter") handleSearch();
            }}
          />
          {/* <Button className="h-full" onClick={handleSearch}>
            Найти
          </Button> */}
        </div>
      </div>
      <div className="flex gap-5 items-start mt-5">
        {showFilter && (
          <div className="bg-white p-4 shadow max-w-70 w-full shrink-0 rounded-lg sticky top-23">
            {/* <p className="text-lg font-semibold">Фильтры</p> */}
            <Collapse title="Категории" className="">
              <div className="flex flex-col gap-2">
                {catagoryes.map((c) => {
                  return (
                    <p
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className="p-2 bg-(--main-color) text-white text-sm rounded-lg shadow cursor-pointer lowercase"
                    >
                      {c.name}
                    </p>
                  );
                })}
              </div>
            </Collapse>
            <Collapse title="Тип товара" className="mt-5">
              <div className="flex flex-col gap-2">
                <p className="p-2 bg-(--body-color) rounded-lg shadow">Товар</p>
                <p className="p-2 bg-(--body-color) rounded-lg shadow">
                  Комплект
                </p>
              </div>
            </Collapse>
            <Collapse title="Рейтинг" className="mt-5">
              <div className="flex flex-col gap-2">
                <p className="p-2 bg-(--body-color) rounded-lg shadow">Товар</p>
                <p className="p-2 bg-(--body-color) rounded-lg shadow">
                  Комплект
                </p>
              </div>
            </Collapse>
            <Button onClick={resetFilters} className="mt-5 w-full">Сбросить</Button>
          </div>
        )}
        <div
          className={clsx(
            "grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-2 w-full",
            { "grid-cols-3!": showFilter },
          )}
        >
          {data?.map((p) => (
            <ProductCard key={p.id} product={p}/>
          ))}
        </div>
      </div>
    </div>
  );
};
