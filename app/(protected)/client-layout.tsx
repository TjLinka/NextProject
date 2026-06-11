// app/(protected)/client-layout.tsx  — клиентский
"use client";

import { useQuery } from "@tanstack/react-query";
import { getFavouritesProducts } from "./(shop)/favorite/action";
import React from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: favoriteIds } = useQuery({
    queryKey: ["favourites"],
    queryFn: () => getFavouritesProducts(),
    staleTime: Infinity, // не рефетчит без причины
  });

  return <>{children}</>;
}
