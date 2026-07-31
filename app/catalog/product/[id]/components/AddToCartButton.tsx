"use client";
import { Button } from "@/components/UI/Button";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { Product } from "../../../types";

export const AddToCartButton = ({ product }: { product: Product }) => {
  const inCart = useCartStore((state) => {
    return !!state.cart.find((p) => p.id === product.id);
  });
  const addToCart = useCartStore((state) => state.addToCart);

  if (inCart)
    return (
      <Link href={"/cart"}>
        <Button>Перейти в коризну</Button>
      </Link>
    );
  return (
    <Button
      disabled={product.webreg <= 0}
      onClick={() => {
        addToCart({...product, image_url: product.image_urls[0] });
      }}
    >
      { product.webreg > 0 ? 'Добавить в корзину' : 'Ожидаем поступление'}
    </Button>
  );
};
