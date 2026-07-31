"use client";
import { Product } from "@/app/(protected)/(shop)/catalogold/types";
import { Button } from "@/components/UI/Button";
import { getCatalog } from "@/dbQuery/dbQuerys";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export const RepeatOrderButton = ({ ids }: { ids: [number | string] }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const router = useRouter();

  const handleRepeatOrder = async () => {
    const res = await getCatalog();
    res
      .filter((p: Product) => ids.includes(p.id))
      .forEach((p: Product) => {
        addToCart(p);
      });
    router.push("/cart");
  };

  return <Button onClick={handleRepeatOrder}>Повторить заказ</Button>;
};
