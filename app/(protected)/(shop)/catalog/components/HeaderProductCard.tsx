"use client";
import Image from "next/image";
import { Product } from "../types";
import { localInt } from "@/lib/utils";
import { Button } from "@/components/UI/Button";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import * as motion from "motion/react-client";
import { Counter } from "@/components/UI/Counter";
import { useState } from "react";

export const HeaderProductCard = ({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) => {
  const incr = useCartStore((state) => state.incrCount);
  const decr = useCartStore((state) => state.decrCount);

  const pathname = usePathname()
  const addToCart = useCartStore((state) => state.addToCart);

  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const router = useRouter();

  const inCart = useCartStore((state) => {
    return !!state.cart.find((p) => p.id === product.id);
  });

  const handleProductAction = () => {
    if (!inCart) addToCart(product);
    else router.push("/cart");
  };

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="flex items-center gap-5 p-4">
      <div className={clsx(`bg-white rounded-xl flex gap-2 ${className}`)}>
        <div className="">
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
            className={`w-40 rounded-xl object-contain ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <div className="flex flex-col justify-center gap-3">
          <Link
            href={`/catalog/product/${product.id}`}
            className="hover:text-(--main-text) leading-[100%]"
          >
            <p className="font-semibold text-sm leading-[100%]">
              {product.name}
            </p>
          </Link>
          <div className="flex justify-between items-end">
            <div className="text font-semibold leading-[100%]">Цена</div>
            <div className="flex gap-2 items-end">
              <span className="text-red-400 line-through text-xs leading-[100%]">
                {localInt(product.pricex)} ₽
              </span>
              <span className="text leading-[100%] font-semibold">
                {localInt(product.price)} ₽
              </span>
            </div>
          </div>
          {!(pathname === "/cart/checkout") ? (
            <div className="flex flex-col">
              <Counter
                small
                count={product.count}
                incr={incr}
                decr={decr}
                id={Number(product.id)}
              />
              {product.count === product.webreg && (
                <span className="text-red-500 font-medium text-sm">
                  Макс. количество
                </span>
              )}
            </div>
          ) : (
            <span className="font-semibold text-lg">{product.count} шт.</span>
          )}
        </div>
      </div>
      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }}>
        <Image
          onClick={() => {
            removeFromCart(product.id);
          }}
          src="/icons/Delete.svg"
          alt="Delete Icon"
          width={200}
          height={200}
          className="w-6 h-6 cursor-pointer"
        />
      </motion.div>
    </div>
  );
};
