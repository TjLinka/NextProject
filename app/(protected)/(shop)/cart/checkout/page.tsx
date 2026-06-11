/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import { SectionTitle } from "@/components/UI/SectionTitle";
import { getBalance, getProfileData } from "@/dbQuery/dbQuerys";
import { serverFetch } from "@/lib/auth";
import { useCartStore } from "@/store/cartStore";
import { User } from "@/types/user/types";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Span } from "next/dist/trace";
import Image from "next/image";
import Link from "next/link";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { HeaderProductCard } from "../../catalog/components/HeaderProductCard";
import { localInt } from "@/lib/utils";
import { InputNumber } from "primereact/inputnumber";
import { Nullable } from "primereact/ts-helpers";

export default function CartCheckoutPage() {
  const { data } = useQuery({
    queryKey: ["personal-info"],
    queryFn: async () => {
      return await getProfileData();
    },
    staleTime: 0,
  });

  const totalCartPrice = useCartStore((state) => {
    return state.cart.reduce((acc, p) => acc + p.price * p.count, 0);
  });

  const [bonusSumm, setbonusSumm] = useState<Nullable<number | null>>(0);
  const cart = useCartStore((state) => state.cart);
  const totalPrice = useCartStore((state) => {
    return localInt(state.cart.reduce((acc, p) => acc + p.price * p.count, 0));
  });
  const [delAddress, setDelAddress] = useState<string | null>("");
  const [delPriceModal, setDelPriceModal] = useState(false);
  const [userInfo, setUserInfo] = useState<User>(data);
  const [delPrice, setDelPrice] = useState<string | number>(0);
  const [deliverySystems, setDeliverySystems] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedPaySystem, setselectedPaySystem] = useState(1);
  const [paySystems, setPaySystems] = useState<[]>([]);
  const [selectedDeliverySystem, setSelectedDeliverySystem] = useState<
    number | null
  >(0);
  const [value, setValue] = useState<string | null>("");
  const [items, setItems] = useState([]);

  const { data: balance = [] } = useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      return await getBalance();
    },
  });

  useEffect(() => {
    if (data) {
      setUserInfo(data);
    }
  }, [data]);

  useEffect(() => {
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
        console.log(result.suggestions.map((address: any) => address.value));
        
        setItems(result.suggestions.map((address: any) => address.value));
      })
      .catch((error) => console.log("error", error));
  };

  const getIndexForDelivery = async (address: string | null) => {
    const url =
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
    const token = "52ae40caabe1542609d439363ee0e41abecb7eae";

    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + token,
      },
      body: JSON.stringify({
        query: address,
        locations: [{ country: "*" }],
      }),
    };

    let city = null;

    await fetch(url, options)
      .then((response) => response.json())
      .then((result) => {
        city = result.suggestions[0].data.postal_code;
      })
      .catch((error) => console.log("error", error));
    return city;
  };

  const getDelPrice = async (val: string | null) => {
    setDelPrice(0);
    setDelAddress(val);
    setDelPriceModal(true);
    const index = await getIndexForDelivery(val);
    const params = {
      dsName: selectedDeliverySystem === 1 ? "CDEK" : "RussianPost",
      from:
        selectedDeliverySystem === 1
          ? "г. Пермь, ул. Ветлужская, 3"
          : String(await getIndexForDelivery("г. Пермь, ул. Ветлужская, 3")),
      from_city: String(
        await getIndexForDelivery("г. Пермь, ул. Ветлужская, 3"),
      ),
      tariff_id: "137",
      price: String(totalCartPrice),
      to: String(selectedDeliverySystem === 1 ? val : index),
      to_city: String(index),
      weight: "500",
    };
    const queryString = new URLSearchParams(params).toString();

    const res = await fetch(`/api/cart/del-price?${queryString}`);
    const data = await res.json();
    console.log(data);

    setDelPrice(JSON.parse(data).delivery_prices[0]?.delivery_sum);
    setDelPriceModal(false);
  };

  return (
    <>
      <div className="flex flex-col justify-center md:max-w-[80%] mx-auto">
        <Link href={"/cart"}>
          <Button>Назад в корзину</Button>
        </Link>
        <div className="flex justify-between items-end">
          <SectionTitle className="mt-5">Данные покупателя</SectionTitle>
          <div className="relative cart_icon2">
            <span className="font-semibold cursor-pointer">Ваша корзина</span>
            <div
              className={clsx(
                `bg-white w-100 max-h-130 h-fit top-7 -left-70 shadow-md rounded-xl border overflow-y-auto border-gray-300 absolute z-20 cart_header`,
              )}
            >
              <div className="sticky px-4 py-2 rounded shadow bg-white top-0 flex justify-between items-center">
                <span className="font-semibold">
                  Всего позиций: {cart.length}
                </span>
                {/* <span
                  className="text-(--main-color) cursor-pointer font-semibold hover:underline"
                  onClick={clearCart}
                >
                  Очистить
                </span> */}
              </div>
              {cart.map((p) => {
                return <HeaderProductCard product={p} key={p.id} />;
              })}
              <div className="sticky bottom-0 bg-white shadow-md px-4">
                <hr className="border-1 border-(--main-color)" />
                <div className="flex py-3 justify-between items-center">
                  <div>
                    <p className="leading-[100%] text">Итого:</p>
                    <p className="leading-[100%] font-semibold text-lg mt-1">
                      {totalPrice} ₽
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-5 gap-2 mt-5">
          <Card title="ФИО">
            <InputText value={userInfo?.fullname} className="w-full" />
          </Card>
          <Card title="Телефон">
            <InputText value={userInfo?.mobile_phone} className="w-full" />
          </Card>
          <Card title="Почта (необязательно" className="row-start-2">
            <InputText value={userInfo?.email} className="w-full" />
          </Card>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <SectionTitle className="md:mt-5 mt-2">
              Способ доставки
            </SectionTitle>
            <Card title="Выберите способ доставки" className="mt-5">
              <div className="md:flex grid grid-cols-2 md:gap-5 gap-2">
                <div
                  onClick={() => setSelectedDeliverySystem(0)}
                  className={clsx(
                    "md:w-1/4 md:h-20 h-15 py-1 px-2 capitalize transition-[background, opacity, box-shadow] outline-0 bg-gray-300 duration-250 opacity-60 grayscale-100 ease-in-out rounded-md text-center text-2xl font-semibold flex justify-center items-center  cursor-pointer",
                    {
                      "grayscale-0! bg-gray-100! opacity-100! ring-(--main-color) ring-2 ":
                        selectedDeliverySystem === 0,
                    },
                  )}
                >
                  Самовывоз
                </div>
                {deliverySystems.map((d) => {
                  return (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDeliverySystem(d.id)}
                      className={clsx(
                        "md:w-1/4 md:h-20 h-15 py-1 px-2 capitalize transition-[background, opacity, box-shadow] outline-0 bg-gray-300 duration-250 opacity-60 grayscale-100 ease-in-out rounded-md text-center text-xl font-semibold flex justify-center items-center  cursor-pointer",
                        {
                          "grayscale-0! bg-gray-100! opacity-100! ring-(--main-color) ring-2":
                            selectedDeliverySystem === d.id,
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
            </Card>
            <div className="grid md:grid-cols-2 md:gap-5 gap-2 md:mt-5 mt-2">
              {selectedDeliverySystem !== null &&
              selectedDeliverySystem === 0 ? (
                <Card title="Самовывоз">
                  <span className="">
                    Адрес для самовывоза: <br className="md:hidden block" />
                    <span className="font-semibold text-lg">
                      г. Пермь, ул. Ветлужская, 3
                    </span>
                  </span>
                </Card>
              ) : (
                <Card title="Адрес доставки">
                  <AutoComplete
                    inputClassName="w-full"
                    className="block!"
                    value={value}
                    suggestions={items}
                    onSelect={(e) => getDelPrice(e.value)}
                    completeMethod={queryAddres}
                    onChange={(e) => setValue(e.value)}
                  />
                </Card>
              )}
              {delAddress && delPrice && selectedDeliverySystem !== 0 ? (
                <Card className="">
                  <div>
                    Выбранный адрес доcтавки:&nbsp;
                    <br className="block" />
                    <span className="font-semibold">{delAddress}</span>
                  </div>
                  <p className="">
                    Доставка по данному адресу составит:&nbsp;
                    <br className="block" />
                    <span className="font-semibold">{delPrice} ₽</span>
                  </p>
                </Card>
              ) : null}
            </div>
            <SectionTitle className="md:mt-5 mt-2">Способ оплаты</SectionTitle>
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
            <Card title="Списать баллы" className="mt-5 w-1/2">
              <div>
                <p>
                  Баланс на лицевом счете:{" "}
                  <span className="font-semibold">
                    {localInt(balance[0]?.summ)} ₽
                  </span>
                </p>
                <InputNumber
                  inputId="currency-us"
                  value={bonusSumm}
                  className="w-1/2 mt-2"
                  onValueChange={(e) => setbonusSumm(e.value)}
                  mode="currency"
                  currency="RUB"
                  suffix=""
                  locale="ru"
                />
              </div>
            </Card>
            <Card title="Комментарий к заказу" className="md:mt-5 mt-2">
              <textarea
                className="w-full h-22 border border-gray-300 rounded-lg resize-none p-2"
                placeholder="Комментарий"
              ></textarea>
            </Card>
            <Button className=" w-full md:mt-10 mt-5">Оформить заказ</Button>
          </div>
        </div>
      </div>
      <Dialog
        showCloseIcon={false}
        footer={""}
        content=""
        closeOnEscape={false}
        header="Доставка"
        visible={delPriceModal}
        // style={{ width: "40vw" }}
        onHide={() => {
          if (!delPriceModal) return;
          setDelPriceModal(false);
        }}
      >
        <p className="text-black font-semibold text-lg">
          Происходит расчёт стоимости доставки
        </p>
      </Dialog>
    </>
  );
}
