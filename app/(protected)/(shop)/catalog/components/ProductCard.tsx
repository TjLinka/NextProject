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
import { useIsFavourite, useToggleFavourite } from "@/hooks/useFavorites";

export const ProductCard = React.memo(
  ({
    product,
    className,
    noCatalog,
  }: {
    product: Product;
    className?: string;
    noCatalog?: boolean;
  }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const toast = useRef<Toast>(null);
    const addToCart = useCartStore((state) => state.addToCart);

    const openToast = useModalAndNotify((state) => state.showNotification);

    const router = useRouter();

    const inCart = useCartStore((state) => {
      return !!state.cart.find((p) => p.id === product.id);
    });

    const qc = useQueryClient();

    const mutation = useMutation({
      mutationFn: ({ id, prod }: { id: number | string; prod: Product }) =>
        Promise.resolve(addToCart(prod)),
      onMutate: async ({ id, prod }) => {
        await qc.cancelQueries({ queryKey: ["need_more"] });

        const prev = qc.getQueryData<Product[]>(["need_more"]);

        qc.setQueryData<Product[]>(["need_more"], (old = []) => {
          return old.filter((p) => p.id !== id);
        });
        return { prev };
      },
      onSettled: () => {
        // После успешного запроса синхронизируемся с сервером
        qc.invalidateQueries({ queryKey: ["need_more"] });
      },
    });

    const handleProductAction = () => {
      if (!inCart) {
        mutation.mutate({ id: product.id, prod: product });
      } else router.push("/cart");
    };
    const handleFavouritesButtn = () => {
      toggleFavourite({ id: product.id, isFavourite });
    };

    const isFavourite = useIsFavourite(product.id);
    const { mutate: toggleFavourite } = useToggleFavourite();

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
        {!noCatalog ? (
          <Link
            href={`/catalog/product/${product.id}`}
            className="grow hover:text-(--main-text) leading-[100%]"
          >
            <p className="mt-4 font-semibold md:text-lg text-xs leading-[100%]">
              {product.name}
            </p>
          </Link>
        ) : (
          <p className="mt-4 font-semibold md:text-lg text-xs leading-[100%]">
            {product.name}
          </p>
        )}
        <div className="flex justify-between items-end md:mt-2 mt-1">
          <div className="md:text-xl text-sm font-semibold">Цена</div>
          <div className="flex md:flex-row flex-col md:gap-2 items-end">
            {!noCatalog && (
              <span className="text-red-400 line-through md:text-[16px] text-xs">
                {localInt(product.pricex)} ₽
              </span>
            )}
            <span className="md:text-2xl font-semibold text-lg leading-[100%]">
              {localInt(product.price)} ₽
            </span>
          </div>
        </div>
        {!noCatalog && (
          <div className="flex md:gap-5 gap-2 items-center  md:mt-4 mt-1">
            <Button
              disabled={product.webreg <= 0}
              onClick={handleProductAction}
              className="grow w-full"
            >
              {product.webreg > 0
                ? !inCart
                  ? "Добавить в корзину"
                  : "Перейти в корзину"
                : "Ожидаем поступление"}
            </Button>
            <Image
              onClick={handleFavouritesButtn}
              alt="Favourites Btn"
              src={`/icons/Heart${isFavourite ? "Fill" : ""}.svg`}
              width={200}
              height={200}
              className="md:w-7 w-4 md:h-7 h-4 cursor-pointer md:block hidden"
            />
          </div>
        )}
        <Toast ref={toast} />
      </div>
    );
  },
);

ProductCard.displayName = "ProductCard";
