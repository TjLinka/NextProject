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
    <div className="bg-white shadow md:p-4 p-3 rounded-md grid grid-cols-[minmax(50px,200px)_minmax(200px,400px)_1fr_25px] items-center w-full md:gap-5 gap-1 relative">
      <div className="flex items-center gap-5 col-span-2">
        <Image
          src={product.image_url}
          alt="Cart Prod Image"
          width={700}
          height={700}
          className="md:w-40 w-30 md:h-40 h-30 rounded"
        />
        <div className="flex flex-col justify-center gap-5">
          <Link
            href={`/catalog/product/${product.id}`}
            className="text-(--main-text) leading-[100%] hover:underline"
          >
            <p className="font-semibold md:text-lg text-sm leading-[100%]">
              {product.name}
            </p>
          </Link>
          <p className="md:text-[16px] text-sm font-semibold">
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
      <div className="min-w-1 max-w-1 w-2"></div>
      <div className="flex justify-between flex-col max-w-6.25 h-full">
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
