"use client";
import Image from "next/image";
import { Product } from "../types";
import { localInt } from "@/lib/utils";
import { Button } from "@/components/UI/Button";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

export const ProductCard = ({ product }: { product: Product }) => {

  const addToCart = useCartStore((state) => state.addToCart)

  const handleToCart = () => {
    addToCart(product)
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col">
      <div className="h-50">
        <Image
          src={product.image_url}
          alt="Product Image"
          width={500}
          height={550}
          className="w-full h-full rounded-xl object-cover"
        />
      </div>
      <Link href={`/catalog/product/${product.id}`} className="grow hover:text-[#bf94ff] leading-[100%]">
        <p className="mt-4 font-semibold text-lg leading-[100%]">{product.name}</p>
      </Link>
      <div className="flex justify-between items-end">
        <div className="text-xl font-semibold">Цена</div>
        <div className="flex gap-2 items-end">
          <span className="text-red-400 line-through">{localInt(product.pricex)} ₽</span>
          <span className="text-2xl">{localInt(product.price)} ₽</span>
        </div>
      </div>
      <Button onClick={handleToCart} className="w-full mt-4">Добавить в коризну</Button>
    </div>
  );
};
