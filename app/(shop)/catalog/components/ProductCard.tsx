"use client";
import Image from "next/image";
import { Product } from "../types";
import { localInt } from "@/lib/utils";
import { Button } from "@/components/UI/Button";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToFavourites, removeFromFavourites } from "../../favorite/action";
import { Toast } from "primereact/toast";

export const ProductCard = React.memo(
  ({ product, className }: { product: Product; className?: string }) => {
    const queryClient = useQueryClient();
    const toast = useRef<Toast>(null);
    const addToCart = useCartStore((state) => state.addToCart);

    const path = usePathname() === "/favorite";
    const router = useRouter();

    const mutation = useMutation({
      mutationFn: () => addToFavourites(product.id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["favourites"] });
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Товар добалвен в избранное",
          life: 3000,
        });
      },
    });
    const mutation2 = useMutation({
      mutationFn: () => removeFromFavourites(product.id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["favourites"] });
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "Товар удалён из избранного",
          life: 3000,
        });
      },
    });

    const inCart = useCartStore((state) => {
      return !!state.cart.find((p) => p.id === product.id);
    });

    const handleProductAction = () => {
      if (!inCart) addToCart(product);
      else router.push("/cart");
    };

    useEffect(() => {
      console.log("mounted");
    });

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
          `bg-white p-4 rounded-xl shadow-md flex flex-col ${className}`,
        )}
      >
        <div className="h-70">
          <Image
            src={product.image_url}
            alt="Product Image"
            width={500}
            height={550}
            className="w-full h-full rounded-xl object-contain"
          />
        </div>
        <Link
          href={`/catalog/product/${product.id}`}
          className="grow hover:text-(--main-text) leading-[100%]"
        >
          <p className="mt-4 font-semibold text-lg leading-[100%]">
            {product.name}
          </p>
        </Link>
        <div className="flex justify-between items-end">
          <div className="text-xl font-semibold">Цена</div>
          <div className="flex gap-2 items-end">
            <span className="text-red-400 line-through">
              {localInt(product.pricex)} ₽
            </span>
            <span className="text-2xl">{localInt(product.price)} ₽</span>
          </div>
        </div>
        <div className="flex gap-5 items-center  mt-4">
          <Button onClick={handleProductAction} className="grow w-full">
            {!inCart ? "Добавить в корзину" : "Перейти в корзину"}
          </Button>
          <Image
            onClick={handleFavouritesButtn}
            alt="Favourites Btn"
            src={`/icons/Heart${path ? "Fill" : ""}.svg`}
            width={200}
            height={200}
            className="w-7 h-7 cursor-pointer"
          />
        </div>
        <Toast ref={toast} />
      </div>
    );
  },
);

ProductCard.displayName = "ProductCard";
