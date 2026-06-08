import { Button } from "@/components/UI/Button";
import Link from "next/link";

export const EmptyCart = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center -mt-14">
      <p className="text-4xl font-bold">Корзина пуста!</p>
      <Link href={`/catalog`} className=" w-1/4 d-block mt-5">
        <Button className="w-full mt-5">Перейти в магазин</Button>
      </Link>
    </div>
  );
};
