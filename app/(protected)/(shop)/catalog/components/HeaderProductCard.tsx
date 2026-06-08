"use client";
import Image from "next/image";
import { Product } from "../types";
import { localInt } from "@/lib/utils";
import { Button } from "@/components/UI/Button";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import * as motion from "motion/react-client";

export const HeaderProductCard = ({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) => {
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

  return (
    <div className="flex items-center gap-5  p-4">
      <div className={clsx(`bg-white rounded-xl flex gap-2 ${className}`)}>
        <div className="">
          <Image
            src={product.image_url}
            alt="Product Image"
            width={500}
            height={550}
            className="w-40 rounded-xl object-contain"
          />
        </div>
        <div className="flex flex-col justify-center gap-5">
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
