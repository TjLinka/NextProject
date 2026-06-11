"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { useEffect, useState } from "react";
import { Product } from "../../../types";
import { ProductCard } from "../../../components/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { useQuery } from "@tanstack/react-query";
import { getCatalog } from "@/dbQuery/dbQuerys";
import { getFavouritesProducts } from "@/app/(protected)/(shop)/favorite/action";
export const MayNeddProducts = () => {
  const cart = useCartStore((state) => state.cart);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const [productList, setProductList] = useState<Product[]>([]);

  const { data = [] } = useQuery({
    queryKey: ["need_more"],
    queryFn: async () => {
      const res1 = await getCatalog();
      const excludePrducts = new Set(cart.map((product) => product.id));
      const productsForSwiper = res1.filter(
        (product) => !excludePrducts.has(product.id),
      );
      return productsForSwiper;
    },
    enabled: hasHydrated,
  });


  return (
    <Swiper spaceBetween={30} slidesPerView={"auto"}>
      {data.map((p) => {
        return (
          <SwiperSlide key={p.id} className="w-100 ">
            <ProductCard product={p} />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
