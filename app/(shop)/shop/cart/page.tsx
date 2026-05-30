"use client";

import { useCartStore } from "@/store/cartStore";
import { CartItem } from "./components/CartItem";
import { localInt } from "@/lib/utils";
import { EmptyCart } from "./components/EmptyCart";

export default function CartPage() {
  const cart = useCartStore((state) => state.cart);
    const totalCartPrice = useCartStore((state) => {
        return state.cart.reduce((acc, p) => acc + p.price, 0)
    })

  if (cart.length <= 0) return <EmptyCart/>

  return (
    <>
      <p className="text-3xl font-semibold">Корзина</p>
      <hr className="border-gray-300 my-5" />
      <div className="flex gap-10 ">
        <div className="flex flex-col gap-4 w-2/3">
          {cart.map((p) => {
            return <CartItem product={p} key={p.id} />;
          })}
        </div>
        <div className="bg-white p-4 rounded shadow w-1/3 ">
          <p className="text-2xl font-semibold">Информация о заказе</p>
          <hr className="border-gray-300 my-2" />
          <p>
            <span>Сумма заказа:</span>
            <span> {localInt(totalCartPrice)} ₽</span>
          </p>
          <p>
            <span>Товаров в корзине:</span>
            <span> {localInt(totalCartPrice)} ₽</span>
          </p>
          <p></p>
        </div>
      </div>
    </>
  );
}
