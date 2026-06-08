"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { useEffect, useState } from "react";
import { Product } from "../../../types";
import { ProductCard } from "../../../components/ProductCard";
import { useCartStore } from "@/store/cartStore";
export const MayNeddProducts = () => {
  const cart = useCartStore((state) => state.cart);
  const [productList, setProductList] = useState<Product[]>([]);
  useEffect(() => {
    async function getProducts() {
      const res = await fetch("/api/catalog/products");
      const data: Product[] = await res.json();
      const excludePrducts = new Set(cart.map((product) => product.id));
      const productsForSwiper = data.filter(
        (product) => !excludePrducts.has(product.id),
      );
      setProductList(productsForSwiper);
    }
    getProducts();
  }, [cart]);
  return (
    <Swiper spaceBetween={30} slidesPerView={"auto"}>
      {productList.map((p) => {
        return (
          <SwiperSlide key={p.id} className="w-100 ">
            <ProductCard product={p} />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
