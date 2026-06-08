"use client";
import { useQuery } from "@tanstack/react-query";
import { getFavouritesProducts } from "../action";
import { ProductCard } from "../../catalog/components/ProductCard";
import { Product } from "../../catalog/types";
export const FavoritePageClient = () => {
  const { data } = useQuery<Product[]>({
    queryKey: ["favourites"],
    queryFn: () => getFavouritesProducts(),
  });
  return <div className="grid grid-cols-4 gap-5">
    {data?.map((p) => {
        return <ProductCard product={p} key={p.id}/>
    })}
  </div>
};
