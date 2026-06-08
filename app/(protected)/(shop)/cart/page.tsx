"use client";

import { useCartStore } from "@/store/cartStore";
import { CartItem } from "./components/CartItem";
import { localInt } from "@/lib/utils";
import { EmptyCart } from "./components/EmptyCart";
import Link from "next/link";
import { Button } from "@/components/UI/Button";
import { useModalAndNotify } from "@/store/modalAndNotify";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export default function CartPage() {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalCartPrice = useCartStore((state) => {
    return state.cart.reduce((acc, p) => acc + p.price * p.count, 0);
  });
  const totlaCartProdutsUnic = useCartStore((state) => state.cart.length);
  const totlaCartProduts = useCartStore((state) => {
    return state.cart.reduce((acc, p) => acc + p.count, 0)
  });

  const showToast = useModalAndNotify((state) => state.showNotification);

  const handleClearCart = () => {
    confirmDialog({
      message: "Вы уверны, что хотите очистить корзину?",
      header: "Очистка корзины",
      // icon: "pi pi-info-circle",
      rejectLabel: "Нет",
      acceptLabel: "Да",
      rejectClassName: "bg-red-500! border-0! w-2/3!",
      acceptClassName: "border-0! w-1/3!",
      defaultFocus: "reject",
      accept: () => {
        showToast("warn", "Коризна была очищена", "Очистка корзины");
        clearCart();
      },
      reject: () => {},
    });
  };

  if (cart.length <= 0) return <EmptyCart />;

  return (
    <>
      <div className="flex justify-between">
        <p className="text-3xl font-semibold inline-block border-b-2 border-(--main-color)">
          Корзина
        </p>
        <Button onClick={handleClearCart}>Очистить коризину</Button>
      </div>
      {/* <hr className="border-gray-300 my-5" /> */}
      <div className="flex lg:flex-row flex-col gap-10 items-start mt-5">
        <div className="flex flex-col gap-4 lg:w-2/3 lg:h-auto h-[40vh] overflow-y-auto pr-2">
          {cart.map((p) => {
            return <CartItem product={p} key={p.id} />;
          })}
        </div>
        <div className="bg-white p-4 rounded shadow lg:w-1/3 w-full sticky top-24">
          <p className="text-2xl font-semibold">Информация о заказе</p>
          <hr className="border-gray-300 my-2" />
          <div className="flex flex-col gap-4 mt-4">
            <p>
              <span>Сумма заказа:</span>
              <span className="font-semibold"> {localInt(totalCartPrice)} ₽</span>
            </p>
            <p>
              <span>Всего наименований:</span>
              <span className="font-semibold"> {localInt(totlaCartProdutsUnic)}</span>
            </p>
            <p>
              <span>Всего единиц товара:</span>
              <span className="font-semibold"> {localInt(totlaCartProduts)} шт.</span>
            </p>
          </div>
          <Link href="/cart/checkout">
            <Button className="w-full mt-5">Перейт к оформлению</Button>
          </Link>
        </div>
        <ConfirmDialog draggable={false} />
      </div>
    </>
  );
}
