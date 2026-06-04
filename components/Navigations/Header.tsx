"use client";
import { useAgentStore } from "@/store/agentStore";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Button } from "../UI/Button";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { HeaderProductCard } from "@/app/(shop)/catalog/components/HeaderProductCard";
import { useRouter } from "next/navigation";
import { useModalAndNotify } from "@/store/modalAndNotify";

export const Header = () => {


  const openSuppModal = useModalAndNotify((state) => state.openSupportModal);


  const router = useRouter()
  const [mounted, setMounted] = useState(false);
  const user = useAgentStore((state) => state.agentInfo);
  const cartLength = useCartStore((state) => state.cart.length);
  const cart = useCartStore((state) => state.cart);
  const isAuth = useAgentStore((state) => state.isAuth);
  const logout = useAgentStore((state) => state.logout);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <header
      className={clsx(
        "h-0 bg-white shadow flex opacity-0 transition-[height, opacity] duration-500 justify-between items-center px-0 sticky top-0 z-20",
        {
          "h-20! px-7! opacity-100!": isAuth && mounted,
        },
      )}
    >
      <div></div>
      <div className="flex items-center gap-5">
        <Image
          alt="Support Icon"
          src={`/icons/Support.svg`}
          width={200}
          height={200}
          className="w-7 h-7 cursor-pointer"
          onClick={openSuppModal}
        />
        <div className="relative cart_icon">
          <div
            className="relative"
            onClick={() => {
              router.push("/cart");
            }}
          >
            <Image
              src={"/icons/Cart.svg"}
              width={200}
              height={200}
              alt="Cart Icon"
              className="w-7 h-7 cursor-pointer"
            />
            {cartLength > 0 && (
              <span className=" absolute top-0 -right-1 w-4 h-4 text-xs bg-(--main-color) text-white rounded-full flex justify-center items-center">
                {cartLength}
              </span>
            )}
          </div>
          <div
            className={clsx(
              `bg-white w-100 max-h-100 h-fit top-7 -left-90 shadow-md rounded-xl border overflow-y-auto border-gray-300 absolute ${cartLength ? "hidden" : "hidden!"} cart_header z-20`,
            )}
          >
            {cart.map((p) => {
              return <HeaderProductCard product={p} key={p.id} />;
            })}
          </div>
        </div>
        <Button>Пригласить партнёра</Button>
        <div className="flex gap-2 items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {user.avatar && (
              <Image
                src={user?.avatar}
                alt=""
                width={200}
                height={200}
                className="w-full h-full"
              />
            )}
          </div>
          <span className="font-semibold cursor-pointer" onClick={logout}>
            Выйти
          </span>
        </div>
      </div>
    </header>
  );
};
