"use client";
import Image from "next/image";
import { Product } from "../types";
import { localInt } from "@/lib/utils";
import { Button } from "@/components/UI/Button";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToFavourites, removeFromFavourites } from "../../favorite/action";
import { Toast } from "primereact/toast";
import { useModalAndNotify } from "@/store/modalAndNotify";

export const ProductCard = React.memo(
  ({ product, className }: { product: Product; className?: string }) => {
    const queryClient = useQueryClient();
    const [imageLoaded, setImageLoaded] = useState(false);
    const toast = useRef<Toast>(null);
    const addToCart = useCartStore((state) => state.addToCart);

    const openToast = useModalAndNotify((state) => state.showNotification);

    const path = usePathname() === "/favorite";
    const router = useRouter();

    const mutation = useMutation({
      mutationFn: () => addToFavourites(product.id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["favourites"] });
        openToast("success", "Товар добавлен в избранно");
      },
    });
    const mutation2 = useMutation({
      mutationFn: () => removeFromFavourites(product.id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["favourites"] });
        openToast("success", "Товар удалён из избранного");
      },
    });

    const inCart = useCartStore((state) => {
      return !!state.cart.find((p) => p.id === product.id);
    });

    const handleProductAction = () => {
      if (!inCart) addToCart(product);
      else router.push("/cart");
    };
    const handleFavouritesButtn = () => {
      if (path) {
        mutation2.mutate();
      } else {
        mutation.mutate();
      }
    };
    return (
      <div
        className={clsx(
          `bg-white md:p-4 p-3 rounded-xl shadow-md flex flex-col ${className}`,
        )}
      >
        <div className="md:h-70 h-35">
          {!imageLoaded && (
            <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse space-x-4 flex justify-center items-center">
              <span className="loader"></span>
            </div>
          )}
          <Image
            src={product.image_url}
            alt="Product Image"
            width={300}
            height={350}
            className={`w-full h-full rounded-xl object-contain ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <Link
          href={`/catalog/product/${product.id}`}
          className="grow hover:text-(--main-text) leading-[100%]"
        >
          <p className="mt-4 font-semibold md:text-lg text-xs leading-[100%]">
            {product.name}
          </p>
        </Link>
        <div className="flex justify-between items-end md:mt-0 mt-2">
          <div className="md:text-xl text-sm font-semibold">Цена</div>
          <div className="flex md:flex-row flex-col gap-2 items-end">
            <span className="text-red-400 line-through md:text-[16px] text-xs">
              {localInt(product.pricex)} ₽
            </span>
            <span className="md:text-2xl font-semibold text-lg leading-[100%]">
              {localInt(product.price)} ₽
            </span>
          </div>
        </div>
        <div className="flex md:gap-5 gap-2 items-center  mt-4">
          <Button onClick={handleProductAction} className="grow w-full">
            {!inCart ? "Добавить в корзину" : "Перейти в корзину"}
          </Button>
          <Image
            onClick={handleFavouritesButtn}
            alt="Favourites Btn"
            src={`/icons/Heart${path ? "Fill" : ""}.svg`}
            width={200}
            height={200}
            className="md:w-7 w-4 md:h-7 h-4 cursor-pointer md:block hidden"
          />
        </div>
        <Toast ref={toast} />
      </div>
    );
  },
);

ProductCard.displayName = "ProductCard";
