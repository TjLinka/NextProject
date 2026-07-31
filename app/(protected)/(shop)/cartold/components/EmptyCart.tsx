import { Button } from "@/components/UI/Button";
import Image from "next/image";
import Link from "next/link";

export const EmptyCart = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center -mt-14">
      <Image src={"/imgs/hippo_angry.png"} width={500} height={500} alt="" className="w-30"/>
      <p className="text-4xl font-bold">Корзина пуста!</p>
      <Link href={`/catalog`} className=" md:w-1/4 d-block mt-5">
        <Button className="w-full">Перейти в магазин</Button>
      </Link>
    </div>
  );
};
