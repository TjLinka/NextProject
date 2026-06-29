/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";
import clsx from "clsx";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/UI/Button";
import { useQuery } from "@tanstack/react-query";
import { getCatalog } from "@/dbQuery/dbQuerys";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Collapse } from "@/components/UI/Collapse";
import { Dialog } from "primereact/dialog";
import { useWindowSize } from "@reactuses/core";

export const ShopCatalogClient = ({
  catagoryes,
}: {
  data?: Product[];
  catagoryes: [];
}) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("find") ?? "";
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState(search);
  const [showFilter, setShowFilters] = useState<boolean>(false);
  const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState([catagoryes[1]]);
  const { width } = useWindowSize();

  const PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery<Product[]>({
    queryKey: ["catalog", search, selectedCategory],
    queryFn: async () => {
      return await getCatalog(search, selectedCategory);
    },
  });

  // сбрасываем visibleCount при смене фильтров/поиска
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, selectedCategory]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && data && visibleCount < data.length) {
          setVisibleCount((prev) => prev + PAGE_SIZE);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [data, visibleCount]);

  const visibleData = data?.slice(0, visibleCount);

  const handleSearch = () => {
    if (searchInput) router.push(`/catalog/?find=${searchInput}`);
    else router.push(`/catalog`);
  };

  const onCategoryChange = (e: any) => {
    let _selectedCategories = [...selectedCategories];
    if (e.checked) _selectedCategories.push(e.value);
    else
      _selectedCategories = _selectedCategories.filter(
        (category: any) => category.key !== e.value.key,
      );
    setSelectedCategories(_selectedCategories);
  };

  const resetFilters = () => {
    router.push(`/catalog`);
    setSelectedCategory(null);
    setSearchInput("");
  };

  return (
    <div>
      <div className="gap-2 items-stretch grid grid-cols-4">
        <div
          className="flex shrink-0 justify-center items-center text-white gap-2 px-4 rounded-lg cursor-pointer bg-(--main-color)"
          onClick={() => {
            if (width > 800) setShowFilters(!showFilter);
            else setShowMobileFilter(true);
          }}
        >
          <Image
            src="/icons/Filters.svg"
            alt="Filters"
            width={200}
            height={200}
            className="w-7"
          />
          <span className="text-lg lg:inline hidden">Фильтры</span>
        </div>
        <div className="w-full flex justify-center items-center gap-2 col-span-3">
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
        </div>
      </div>
      <div
        className={clsx(
          "grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-2 w-full mt-5",
        )}
      >
        {visibleData?.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {/* sentinel внутри грида */}
        <div ref={sentinelRef} className="col-span-full h-1" />
      </div>

      <Dialog
        draggable={false}
        style={{ width: "50vw" }}
        breakpoints={{ "1024px": "65vw", "641px": "90vw" }}
        header="Фильтры"
        visible={showMobileFilter}
        onHide={() => setShowMobileFilter(false)}
      >
        <div className="bg-white max-w-70 w-full shrink-0 rounded-lg sticky top-23">
          <Collapse title="Категории" className="">
            <div className="flex flex-col gap-2">
              {catagoryes.map((c: any) => (
                <p
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={clsx(
                    "p-2  text-white text-sm rounded-lg shadow cursor-pointer lowercase",
                    {
                      "bg-(--main-color)": selectedCategory === c.id,
                    },
                  )}
                >
                  {c.name}
                </p>
              ))}
            </div>
          </Collapse>
          <Collapse title="Тип товара" className="mt-2">
            <div className="flex flex-col gap-2">
              <p className="p-2 bg-(--body-color) rounded-lg shadow">Товар</p>
              <p className="p-2 bg-(--body-color) rounded-lg shadow">
                Комплект
              </p>
            </div>
          </Collapse>
          <Collapse title="Рейтинг" className="mt-2">
            <div className="flex flex-col gap-2">
              <p className="p-2 bg-(--body-color) rounded-lg shadow">Товар</p>
              <p className="p-2 bg-(--body-color) rounded-lg shadow">
                Комплект
              </p>
            </div>
          </Collapse>
          <Button onClick={resetFilters} className="mt-5 w-full">
            Сбросить
          </Button>
        </div>
      </Dialog>
    </div>
  );
};
