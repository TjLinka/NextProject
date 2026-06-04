"use client";
import Image from "next/image";
import { Product } from "../../catalog/types";
import { localInt } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { InputNumber } from "primereact/inputnumber";
import { Counter } from "@/components/UI/Counter";
import * as motion from "motion/react-client";
import { addToFavourites } from "../../favorite/action";

export const CartItem = ({ product }: { product: Product }) => {
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const incr = useCartStore((state) => state.incrCount);
  const decr = useCartStore((state) => state.decrCount);

  const handleRemoveFromCart = async () => {
    removeFromCart(product.id);
  };

  const handleFavouritesAction = async () => {
    // api/partner/Favourites/delete/{id}
    await addToFavourites(product.id)
  }

  return (
    <div className="bg-white shadow p-4 rounded grid grid-cols-[200px_minmax(200px,400px)_1fr_40px] items-center w-full gap-5 relative">
      <div className="flex items-center gap-5 col-span-2">
        <Image
          src={product.image_url}
          alt="Cart Prod Image"
          width={700}
          height={700}
          className="w-40 h-40 rounded"
        />
        <div className="flex flex-col justify-center gap-5">
          <Link
            href={`/catalog/product/${product.id}`}
            className="text-(--main-text) leading-[100%] hover:underline"
          >
            <p className="font-semibold text-lg leading-[100%]">
              {product.name}
            </p>
          </Link>
          <p className="text font-semibold">
            Цена за штуку: {localInt(product.price)} ₽
          </p>
          <Counter
            count={product.count}
            incr={incr}
            decr={decr}
            id={Number(product.id)}
          />
        </div>
      </div>
      <div className="w-50"></div>
      <div className="flex justify-between flex-col h-full">
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
          className="w-fit"
        >
          <Image
            src={`/icons/Heart.svg`}
            width={100}
            height={100}
            alt="Favor Icon"
            onClick={handleFavouritesAction}
            className="w-6 h-6 bottom-2 right-2 cursor-pointer"
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
          className="w-fit"
        >
          <Image
            src={`/icons/Delete.svg`}
            width={100}
            height={100}
            alt="Delete Icon"
            onClick={handleRemoveFromCart}
            className="w-6 h-6 bottom-2 right-2 cursor-pointer"
          />
        </motion.div>
      </div>
    </div>
  );
};
