/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";

export const ShopCatalogClient = ({
  data,
  catagoryes,
}: {
  data: Product[];
  catagoryes: any;
}) => {
  return (
    <div className="flex gap-10 items-start ">
      <div className="bg-white p-4 shadow max-w-70 w-full shrink-0 rounded-lg sticky top-0">
        <p className="text-lg font-semibold">Фильтры</p>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {data.map((p) => {
          return <ProductCard key={p.id} product={p} />;
        })}
      </div>
    </div>
  );
};
