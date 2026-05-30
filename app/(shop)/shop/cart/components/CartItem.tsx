"use client";
import Image from "next/image";
import { Product } from "../../catalog/types";
import { localInt } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

export const CartItem = ({ product }: { product: Product }) => {
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const handleRemoveFromCart = () => {
    removeFromCart(product.id)
  }
  return (
    <div className="bg-white shadow p-4 rounded flex w-full gap-5 relative">
      <div>
        <Image
          src={product.image_url}
          alt="Cart Prod Image"
          width={700}
          height={700}
          className="w-20 h-20 rounded"
        />
      </div>
      <div className="flex flex-col justify-between">
        <p>{product.name}</p>
        <p>Цена за шт.: {localInt(product.price)} ₽</p>
      </div>
      <Image
        src={`/icons/Delete.svg`}
        width={100}
        height={100}
        alt="Delete Icon"
        onClick={handleRemoveFromCart}
        className="w-6 h-6 absolute bottom-2 right-2 cursor-pointer"
      />
    </div>
  );
};
