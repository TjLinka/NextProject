"use client";
import { Card } from "@/components/UI/Card";
import { SectionTitle } from "@/components/UI/SectionTitle";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";
import { ProductCard } from "../(shop)/catalog/components/ProductCard";
import { Product } from "../(shop)/catalog/types";

interface ActivityProps {
  activ: number;
  active_dte: Date | null;
  active_dte2: Date | null;
}

export default function ActivityPage() {
  const [selectedPaySystem, setselectedPaySystem] = useState(1);

  const { data, isLoading } = useQuery<ActivityProps>({
    queryKey: ["activity"],
    queryFn: async () => {
      const res = await fetch("/api/activity");
      const data = await res.json();
      return data;
    },
  });

  const { data : activity_items, isLoading : loadActivityItems } = useQuery<Product[]>({
    queryKey: ["activity-items"],
    queryFn: async () => {
      const res = await fetch("/api/activity/items");
      const data = await res.json();
      return data;
    },
  });

  return (
    <>
      {!isLoading && (
        <div>
          <p>
            <span className="text-4xl font-semibold">{data?.activ ? "Активен" : "Не активен"}</span>
          </p>
          <p className="text-lg">
            Основная активность:{" "}
            {moment(data?.active_dte).format("DD MMMM YYYY")}
          </p>
          <p className="text-lg">
            Дополнительная активность: &nbsp;
            {data?.active_dte2
              ? moment(data?.active_dte2).format("DD MMMM YYYY")
              : "-"}
          </p>
        </div>
      )}
      <Card title="Выберите способ оплаты" className="md:mt-5 mt-2">
        <div className="md:flex grid grid-cols-2 md:gap-5 gap-2">
          <div
            onClick={() => setselectedPaySystem(1)}
            className={clsx(
              "bg-gray-300 grayscale-100 p-2 opacity-60 rounded-md flex justify-center items-center md:w-1/5 md:h-20 h-15 cursor-pointer transition-[background, opacity, box-shadow] duration-250",
              {
                "grayscale-0! opacity-100! bg-gray-100! ring-(--main-color) ring-2":
                  selectedPaySystem === 1,
              },
            )}
          >
            <Image
              alt="Pay System Image"
              width={200}
              height={200}
              src={"/imgs/SberPay.svg"}
              className="w-full h-full"
            />
          </div>
          <div
            onClick={() => setselectedPaySystem(2)}
            className={clsx(
              "bg-gray-300 grayscale-100 p-2 opacity-60 rounded-md flex justify-center items-center md:w-1/5 md:h-20 h-15 cursor-pointer transition-[background, opacity, box-shadow] duration-250",
              {
                "grayscale-0! opacity-100! bg-gray-100! ring-(--main-color) ring-2":
                  selectedPaySystem === 2,
              },
            )}
          >
            <Image
              alt="Pay System Image"
              width={200}
              height={200}
              src={"/imgs/um.svg"}
              className="w-full h-full"
            />
          </div>
          <div
            onClick={() => setselectedPaySystem(3)}
            className={clsx(
              "bg-gray-300 grayscale-100 p-2 opacity-60 rounded-md flex justify-center items-center md:w-1/5 md:h-20 h-15 cursor-pointer transition-[background, opacity, box-shadow] duration-250",
              {
                "grayscale-0! opacity-100! bg-gray-100! ring-(--main-color) ring-2":
                  selectedPaySystem === 3,
              },
            )}
          >
            <Image
              alt="Pay System Image"
              width={200}
              height={200}
              src={"/imgs/yap.svg"}
              className="w-full h-full"
            />
          </div>
          <div
            onClick={() => setselectedPaySystem(4)}
            className={clsx(
              "bg-gray-300 grayscale-100 p-2 opacity-60 rounded-md flex justify-center items-center md:w-1/5 md:h-20 h-15 cursor-pointer transition-[background, opacity, box-shadow] duration-250",
              {
                "grayscale-0! opacity-100! bg-gray-100! ring-(--main-color) ring-2":
                  selectedPaySystem === 4,
              },
            )}
          >
            <Image
              alt="Pay System Image"
              width={200}
              height={200}
              src={"/imgs/split.svg"}
              className="w-full h-full"
            />
          </div>
          <div
            onClick={() => setselectedPaySystem(5)}
            className={clsx(
              "bg-gray-300 grayscale-100 p-2 opacity-60 rounded-md flex justify-center items-center md:w-1/5 md:h-20 h-15 cursor-pointer transition-[background, opacity, box-shadow] duration-250",
              {
                "grayscale-0! opacity-100! bg-gray-100! ring-(--main-color) ring-2":
                  selectedPaySystem === 5,
              },
            )}
          >
            <Image
              alt="Pay System Image"
              width={200}
              height={200}
              src={"/imgs/sbp.svg"}
              className="w-full h-full"
            />
          </div>
        </div>
      </Card>
      <SectionTitle className="mt-5" big>
        Абонименты
      </SectionTitle>
      <div className="grid grid-cols-3 gap-5 mt-5">
            {activity_items?.map((p) => {
              return <ProductCard key={p.id} product={p} noCatalog/>
            })}
      </div>
    </>
  );
}
