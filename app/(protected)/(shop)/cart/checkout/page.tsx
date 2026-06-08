/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { User } from "@/types/user/types";
import clsx from "clsx";
import { Span } from "next/dist/trace";
import Image from "next/image";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";

export default function CartCheckoutPage() {
  const [userInfo, setUserInfo] = useState<User>();
  const [deliverySystems, setDeliverySystems] = useState<
    { id: number; name: string }[]
  >([]);
  const [paySystems, setPaySystems] = useState<[]>([]);
  const [selectedDeliverySystem, setSelectedDeliverySystem] = useState<
    number | null
  >(null);
  const [value, setValue] = useState<string | null>();
  const [items, setItems] = useState([]);
  useEffect(() => {
    // async function getUserData() {
    //   const res = await fetch("/api/user/me");
    //   const data = await res.json();
    //   setUserInfo(data);
    // }
    async function getDelSystems() {
      const res = await fetch("/api/cart/del-systems");
      const data = await res.json();
      data.shift();
      setDeliverySystems(data);
    }
    async function getPaySystems() {
      const res = await fetch("/api/cart/pay-systems", {
        method: "POST",
      });
      const data = await res.json();
      console.log(data);
      setPaySystems(data);
    }
    // getUserData();
    getDelSystems();
    getPaySystems();
  }, []);

  const handleSelectDeliverySystem = (id: number) => {
    setSelectedDeliverySystem(id);
  };

  const queryAddres = (val: AutoCompleteCompleteEvent) => {
    const url =
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
    const token = "52ae40caabe1542609d439363ee0e41abecb7eae";
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + token,
      },
      body: JSON.stringify({
        query: val.query,
        locations: [{ country: "*" }],
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result.suggestions.map((address) => address.value));

        setItems(result.suggestions.map((address: any) => address.value));
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <>
      <span className="text-2xl font-semibold pb-1 border-b-2 border-[#bf94ff]">
        Данные покупателя
      </span>
      <div className="grid grid-cols-3 gap-5 mt-5">
        <div className="w-full">
          <p className="font-semibold">Ф.И.О.</p>
          <InputText
            value={userInfo?.fullname}
            // onInput={(e) => {
            //   setUserInfo({ ...userInfo, fullname: e.value });
            // }}
            className="w-full"
          />
        </div>
        <div className="w-full">
          <p className="font-semibold">Телефон</p>
          <InputText
            value={userInfo?.mobile_phone}
            // onInput={(e) => {
            //   setUserInfo({ ...userInfo, mobile_phone: e.value });
            // }}
            className="w-full"
          />
        </div>
        <div className="w-full">
          <p className="font-semibold">E-mail (необязательно)</p>
          <InputText
            value={userInfo?.email}
            // onInput={(e) => {
            //   setUserInfo({ ...userInfo, email: e.value });
            // }}
            className="w-full"
          />
        </div>
      </div>
      <div className="w-fit text-2xl font-semibold pb-1 border-b-2 border-[#bf94ff] mt-10">
        Способ доставки
      </div>
      <div className="flex gap-5 mt-5">
        {deliverySystems.map((d) => {
          return (
            <div
              key={d.id}
              onClick={() => setSelectedDeliverySystem(d.id)}
              className={clsx(
                "bg-white  w-[200px] h-[50px] py-1 capitalize transition-[background] duration-150 ease-in-out rounded shadow text-center text-xl font-semibold flex justify-center items-center  cursor-pointer",
                {
                  "bg-[#bf94ff]! text-white": selectedDeliverySystem === d.id,
                },
              )}
            >
              <Image
                src={`/imgs/${d.name}.png`}
                width={200}
                height={100}
                alt="Del System Img"
                className="h-full object-contain"
              />
            </div>
          );
        })}
      </div>
      {selectedDeliverySystem !== null && selectedDeliverySystem === 0 ? (
        <div className="text-xl font-semibold mt-5">
          Адрес для самовывоза: г. Пермь, ул. Ветлужская, 3
        </div>
      ) : (
        <AutoComplete
          inputClassName="w-full"
          className="w-1/3 block! mt-5"
          value={value}
          suggestions={items}
          completeMethod={queryAddres}
          onChange={(e) => setValue(e.value)}
        />
      )}
      {value && (
        <div className="mt-2 text-[18px]">
          Выбранный адрес доcтавки: {value}
        </div>
      )}
      <div className="w-fit text-2xl font-semibold pb-1 border-b-2 border-[#bf94ff] mt-10">
        Способ оплаты
      </div>
      <div className="grid grid-cols-4 gap-5">
        {paySystems.map((ps) => {
          return <div key={ps.paysystem_id} className="">{ps.name}</div>;
        })}
      </div>
    </>
  );
}
