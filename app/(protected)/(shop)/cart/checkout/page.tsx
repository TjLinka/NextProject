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
import { useCallback, useEffect, useState } from "react";
import { HeaderProductCard } from "../../catalog/components/HeaderProductCard";
import { localInt } from "@/lib/utils";
import { InputNumber } from "primereact/inputnumber";
import { Nullable } from "primereact/ts-helpers";
import {
  createOrderFinalStep,
  createOrderStep1,
  createOrderStep2,
  withdrawPoints,
} from "@/lib/actions";
import _ from "lodash";
import PickupMap from "@/app/(protected)/test/components/PickupMap";
import { RadioButton } from "primereact/radiobutton";

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
  const addProductToCart = useCartStore((state) => state.addToCart);
  const totalPrice = useCartStore((state) => {
    return state.cart.reduce((acc, p) => acc + p.price * p.count, 0);
  });
  const [isDeliveryFree, setIsDeliveryFree] = useState(false);
  const [delAddress, setDelAddress] = useState<string | null>("");
  const [delPriceModal, setDelPriceModal] = useState(false);
  const [userInfo, setUserInfo] = useState<User>(data);
  const [delPrice, setDelPrice] = useState<string | number>(0);
  const [deliverySystems, setDeliverySystems] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedPaySystem, setselectedPaySystem] = useState(2);
  const [paySystems, setPaySystems] = useState<[]>([]);
  const [selectedDeliverySystem, setSelectedDeliverySystem] = useState<
    number | null
  >(1);
  const [value, setValue] = useState<string | null>("");
  const [items, setItems] = useState([]);
  const [comm, setComm] = useState("");
  const [inAction, setInAction] = useState(false);
  const [allPVZ, setPVZ] = useState([]);
  const [allPVZLoaded, setallPVZLoaded] = useState(false);
  const [showDelErrorModal, setshowDelErrorModal] = useState(false);
  const [selectedPVZ, setPVZAddress] = useState("");
  const [CDEKDelType, setCDEKDelType] = useState(0);
  const [UserLocation, setUserLocation] = useState([]);
  const [delErrorMessage, setdelErrorMessage] = useState("");

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
      // data.filter((d) => d.id === 1)
      setDeliverySystems(data.filter((d) => d.id === 1));
    }
    async function getPaySystems() {
      const res = await fetch("/api/cart/pay-systems", {
        method: "POST",
      });
      const data = await res.json();
      console.log(data);

      setPaySystems(data);
    }
    async function getPvz() {
      const res = await fetch("/api/cart/pvz");
      const data = await res.json();
      console.log(data);
      setPVZ(data);
      setallPVZLoaded(true);
    }
    getDelSystems();
    getPaySystems();
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        console.log(latitude, longitude);

        setUserLocation([latitude, longitude]);
        getPvz();
      },
      (error) => {
        console.error(error);
      },
    );
  }, []);

  useEffect(() => {
    async function checkFreeDelivery() {
      const res = await fetch("/api/cart/check-free-del", {
        method: "POST",
        body: JSON.stringify({ volume: totalPrice }),
      });
      const data = await res.json();
      if (data.upgrade_enabled) setIsDeliveryFree(true);
      else setIsDeliveryFree(false);
    }
    checkFreeDelivery();
  }, [totalCartPrice]);

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
          ? "Белокуриха , ул Бийская 24"
          : String(await getIndexForDelivery("Белокуриха , ул Бийская 24")),
      from_city: String(
        await getIndexForDelivery("Белокуриха , ул Бийская 24"),
      ),
      tariff_id: "136",
      price: String(totalCartPrice),
      to: String(selectedDeliverySystem === 1 ? val : index),
      to_city: String(index),
      weight: "500",
    };
    const queryString = new URLSearchParams(params).toString();

    const res = await fetch(`/api/cart/del-price?${queryString}`);
    const data = await res.json();

    if (isDeliveryFree) {
      setDelPrice("0");
    } else {
      if (JSON.parse(data).StatusCode !== 500) {
        setDelPrice(JSON.parse(data).delivery_prices[0]?.delivery_sum);
        const res = await fetch(`/api/cart/product?id=${201}`);
        const product = await res.json();
        product.count = Number(
          JSON.parse(data).delivery_prices[0]?.delivery_sum,
        ).toFixed(0);
        // addProductToCart(product)
      } else {
        setdelErrorMessage("По данному адресу доставка временно не доступна");
        setshowDelErrorModal(true);
      }
    }
    setDelPriceModal(false);
  };

  const createAndPayOrder = async () => {
    setInAction(true);
    // const res = await checkProdStockLeft();
    // if (res) {
    // if (cart.length > 0) {
    //   const result = await Promise.all(
    //     cart
    //       .filter((prod) => prod.id !== 37888)
    //       .map(
    //         async (prod) =>
    //           await GApi.get(`api/partner/Catalog/get-single/${prod.id}`),
    //       ),
    //   );
    //   store.updateProdsInfo(
    //     result.map(({ data }) => ({
    //       id: data.id,
    //       price: data.price,
    //       pricex: data.pricex,
    //       name: data.name,
    //       points: data.points,
    //     })),
    //   );
    // }
    const Response = await createOrderStep1({
      stock: 0,
      is_pickup: true,
      comm,
      recipient_phone: userInfo?.lastname,
      delivery_system_id: 1,
      delivery_address: "Москва",
    });
    console.log(Response);

    const mass = cart.map((prod) => {
      return {
        webshop_id: Response.id,
        item_id: prod.id,
        cnt: prod.id === 201 ? Number(prod.price) : Number(prod.count),
      };
    });
    if (selectedDeliverySystem && !isDeliveryFree) {
      mass.push({
        webshop_id: Response.id,
        item_id: 201,
        cnt: Number(delPrice),
      });
    }
    await createOrderStep2([...mass]);
    if (bonusSumm) {
      const res = await withdrawPoints({
        doc_id: Response.id,
        amount: bonusSumm,
        idacc: 0,
      });
      console.log(res);
    }
    const data = await createOrderFinalStep({
      ruleId: 38,
      // paysystem: pay_system_type.value,
      paysystem: "YooMoney",
      webshopId: Response.id,
      sum: _.round(Number(totalPayPrice), 2),
      // sum: _.round(Number(totalCartPrice - bonusSumm), 2),
    });
    console.log(data);

    window.location = data.confirmation.confirmation_url;
    // }
    setInAction(false);
  };

  // Computed
  const totalOrderPrice =
    selectedDeliverySystem !== 0
      ? Number(totalPrice) + Number(delPrice)
      : Number(totalPrice);

  const totalPayPrice = Number(totalOrderPrice) - Number(bonusSumm);
  const maxForWithdraw = Math.min(balance[0]?.summ, totalCartPrice * 0.7);

  const setDeliveryAddress = useCallback(({ address }: any) => {
    console.log(address);
    setPVZAddress(address);
  }, []);

  useEffect(() => {
    if (selectedPVZ !== "") getDelPrice(selectedPVZ);
  }, [selectedPVZ]);

  const showMap = allPVZLoaded && selectedDeliverySystem !== 0 && !CDEKDelType;

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
            <InputText value={userInfo?.lastname} className="w-full" />
          </Card>
          <Card title="Телефон">
            <InputText value={userInfo?.mobile_phone} className="w-full" />
          </Card>
          <Card title="Почта (необязательно)" className="row-start-2">
            <InputText value={userInfo?.email} className="w-full" />
          </Card>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <SectionTitle className="md:mt-5 mt-2">
              Способ доставки
            </SectionTitle>
            <Card className="mt-5" fit>
              <div className="md:flex grid grid-cols-2 md:gap-5 gap-2">
                <div
                  onClick={() => setSelectedDeliverySystem(0)}
                  className={clsx(
                    "md:h-20 h-15 py-1 px-2 capitalize transition-[background, opacity, box-shadow] outline-0 bg-gray-300 duration-250 opacity-60 grayscale-100 ease-in-out rounded-md text-center text-2xl font-semibold flex justify-center items-center  cursor-pointer",
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
                        " md:h-20 h-15 py-1 px-2 capitalize transition-[background, opacity, box-shadow] outline-0 bg-gray-300 duration-250 opacity-60 grayscale-100 ease-in-out rounded-md text-center text-xl font-semibold flex justify-center items-center  cursor-pointer",
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
            {/* <Card fit className="mt-5">
              <div className="flex flex-wrap gap-3">
                <div className="flex align-items-center">
                  <RadioButton
                    inputId="ingredient1"
                    name="pizza"
                    value="Cheese"
                    onChange={() => setCDEKDelType(0)}
                    checked={CDEKDelType === 0}
                  />
                  <label htmlFor="ingredient1" className="ml-2">
                    До ПВЗ
                  </label>
                </div>
                <div>
                  <RadioButton
                    inputId="ingredient2"
                    name="pizza"
                    value="Mushroom"
                    onChange={() => setCDEKDelType(1)}
                    checked={CDEKDelType === 1}
                  />
                  <label htmlFor="ingredient2" className="ml-2">
                    До двери
                  </label>
                </div>
              </div>
            </Card> */}
            <div className="rounded-2xl overflow-hidden shadow-md mt-5">
              {showMap && (
                <PickupMap
                  points={allPVZ}
                  onSelect={setDeliveryAddress}
                  userLocation={UserLocation}
                />
              )}
            </div>
            <div className="grid md:grid-cols-2 md:gap-5 gap-2 md:mt-5 mt-2">
              {selectedDeliverySystem !== null &&
              selectedDeliverySystem === 0 ? (
                <Card title="Самовывоз">
                  <span className="">
                    Адрес для самовывоза: <br className="md:hidden block" />
                    <span className="font-semibold text-lg">
                      Белокуриха , ул Бийская 24
                    </span>
                  </span>
                </Card>
              ) : (
                !showMap && (
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
                )
              )}
              {delAddress && delPrice && selectedDeliverySystem !== 0 ? (
                <Card className="">
                  <div>
                    Выбранный адрес доcтавки:&nbsp;
                    <br className="block" />
                    <span className="font-semibold">{delAddress}</span>
                  </div>
                  <p className="">
                    Стоимость доставки по указанному адресу составит:&nbsp;
                    <br className="block" />
                    <span className="font-semibold">
                      {isDeliveryFree ? "Бесплатно" : `${delPrice} ₽`}
                    </span>
                  </p>
                </Card>
              ) : null}
            </div>
            <SectionTitle className="md:mt-5 mt-2">Способ оплаты</SectionTitle>
            <Card title="Выберите способ оплаты" className="md:mt-5 mt-2" fit>
              <div className="md:flex grid grid-cols-2 md:gap-5 gap-2">
                {/* <div
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
                </div> */}
                <div
                  onClick={() => setselectedPaySystem(2)}
                  className={clsx(
                    "bg-gray-300 grayscale-100 p-2 opacity-60 rounded-md flex justify-center items-center  md:h-20 h-15 cursor-pointer transition-[background, opacity, box-shadow] duration-250",
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
                {/* <div
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
                </div> */}
              </div>
            </Card>
            <div className="grid grid-cols-2 md:gap-5 gap-2 mt-5">
              <Card title="Списать баллы">
                <div>
                  <p>
                    Баланс на лицевом счете: &nbsp;
                    <span className="font-semibold">
                      {localInt(balance[0]?.summ)} ₽
                    </span>
                  </p>
                  <span className="text-red-500 text-sm">
                    Макс. для списания: {maxForWithdraw.toFixed(2)} ₽
                  </span>
                  <InputNumber
                    inputId="currency-us"
                    value={bonusSumm}
                    max={maxForWithdraw}
                    className="w-full mt-2"
                    onValueChange={(e) => setbonusSumm(e.value)}
                    mode="currency"
                    currency="RUB"
                    suffix=""
                    locale="ru"
                  />
                </div>
              </Card>
              <Card title="Комментарий к заказу" className="md:mt-0 mt-2">
                <textarea
                  value={comm}
                  onChange={(e) => setComm(e.currentTarget.value)}
                  className="w-full h-22 border border-gray-300 rounded-lg resize-none p-2"
                  placeholder=""
                ></textarea>
              </Card>
            </div>
            <SectionTitle className="mt-5">Итог</SectionTitle>
            <Card className="mt-5">
              <p>
                <span>Сумма корзины: </span>
                <span>{localInt(totalPrice)} ₽</span>
              </p>
              {Number(delPrice) > 0 && selectedDeliverySystem !== 0 && (
                <p>
                  <span>Стоимость доставки: </span>
                  <span>+ {localInt(Number(delPrice))} ₽</span>
                </p>
              )}
              {Number(bonusSumm) > 0 && (
                <p>
                  <span>Сумма баллов для списания: </span>
                  <span>- {localInt(Number(bonusSumm))} ₽</span>
                </p>
              )}
              <p className="text-xl font-semibold mt-2">
                <span>Итого к оплате: </span>
                <span>{localInt(totalPayPrice)} ₽</span>
              </p>
            </Card>
            <Button
              className=" w-full text-xl! uppercase font-bold! md:mt-10 mt-5 h-15 bg-[#abf9ee]"
              onClick={createAndPayOrder}
            >
              Оформить заказ
            </Button>
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
      <Dialog
        footer={""}
        content=""
        header="Доставка"
        visible={showDelErrorModal}
        // style={{ width: "40vw" }}
        onHide={() => {
          if (!showDelErrorModal) return;
          setshowDelErrorModal(false);
        }}
      >
        <p className="text-red-500 font-semibold text-lg">{delErrorMessage}</p>
      </Dialog>
    </>
  );
}
