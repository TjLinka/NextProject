"use client";
import { useQuery } from "@tanstack/react-query";
import { getFavouritesProducts } from "../action";
import { ProductCard } from "../../catalog/components/ProductCard";
import { Product } from "../../catalog/types";
import { EmptyFavor } from "./EmptyFavor";
export const FavoritePageClient = () => {
  const { data = [] } = useQuery<Product[]>({
    queryKey: ["favourites"],
    queryFn: () => getFavouritesProducts(),
  });
  if (data?.length <= 0) return <EmptyFavor/>
  return <div className="grid grid-cols-4 gap-5">
    {data?.map((p) => {
        return <ProductCard product={p} key={p.id}/>
    })}
  </div>
};
