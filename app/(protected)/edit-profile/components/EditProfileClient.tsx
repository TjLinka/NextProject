/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/UI/Button";
import { User } from "@/types/user/types";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { useCallback, useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { Nullable } from "primereact/ts-helpers";
import { RadioButton } from "primereact/radiobutton";
import { editAgentInfo } from "@/lib/actions";
import clsx from "clsx";

type socialsInfo = {
  nickname: string;
  short_link: string;
  social_media_id: number;
  readonly social_media_name: string;
};

export const EditProfileClient = ({
  data,
  socials,
}: {
  data: User;
  socials: socialsInfo[];
}) => {
  console.log(data);

  const [userInfo, setUserInfo] = useState<User>(data);
  const [birth_date, setbirth_date] = useState<Nullable<Date>>(
    new Date(data.birth_date),
  );
  const [phoneCheckAction, setphoneCheckAction] = useState(false);
  const [phoneText, setPhoneText] = useState("");
  const [phoneUnic, setPhoneUnic] = useState(false);
  const router = useRouter();

  const handleInputForm = useCallback((val: string | number, key: string) => {
    setUserInfo((prev) => ({
      ...prev,
      [key]: val,
    }));
  }, []);

  const handleChangeBthDte = (val: Nullable<Date>) => {
    setbirth_date(val);
  };

  const handleSaveChanges = async () => {
    if (userInfo.mobile_phone.replace(/\D/g, "").length < 10) return;
    setphoneCheckAction(true);
    const res = await fetch(
      `/api/misc/check-phone-unic?input=${userInfo.mobile_phone}`,
    );
    const data = await res.json();
    if (data.is_unique) {
      setPhoneText("Телефон можно использовать");
      setPhoneUnic(true);
    } else {
      setPhoneText("Телефон уже занят");
      setPhoneUnic(false);
    }
    setphoneCheckAction(false);
    if (phoneUnic) {
      const res = await editAgentInfo(userInfo);
      console.log(res);
    }
  };

  // useEffect(() => {
  //   // если номер ещё не введён полностью — не дёргаем API
  //   if (userInfo.mobile_phone.replace(/\D/g, "").length < 10) return;
  //   const timer = setTimeout(async () => {
  //     setphoneCheckAction(true);
  //     const res = await fetch(
  //       `/api/misc/check-phone-unic?input=${userInfo.mobile_phone}`,
  //     );
  //     const data = await res.json();
  //     if (data.is_unique) {
  //       setPhoneText("Телефон можно использовать");
  //       setPhoneUnic(true);
  //     } else {
  //       setPhoneText("Телефон уже занят");
  //       setPhoneUnic(false);
  //     }
  //     setphoneCheckAction(false);
  //   }, 500);

  //   return () => clearTimeout(timer); // отменяем предыдущий таймер при каждом новом рендере
  // }, [userInfo.mobile_phone]);

  return (
    <div className="h-full">
      <Button
        onClick={() => {
          router.replace("/");
        }}
      >
        Вернуться
      </Button>
      <div className="bg-white md:p-4 p-3 rounded shadow w-full mt-5">
        <p className="text-2xl font-semibold border-b-2 border-(--main-color) inline-block">
          Персональные даннные
        </p>
        <div className="grid md:grid-cols-3 items-start gap-5 mt-5">
          <InputText
            value={userInfo.lastname}
            id="username"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputForm(e.target.value, "lastname")
            }
          />
          <InputText
            value={userInfo.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputForm(e.target.value, "email")
            }
          />
          <div>
            <InputText
              value={userInfo.mobile_phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputForm(e.target.value, "mobile_phone")
              }
            />{" "}
            <br />
            <span
              className={clsx("", {
                "text-green-500": phoneUnic && !phoneCheckAction,
                "text-red-500": !phoneUnic && !phoneCheckAction,
              })}
            >
              {phoneCheckAction ? "Проверка..." : phoneText}
            </span>
          </div>
          <Calendar
            value={birth_date}
            onChange={(e) => handleChangeBthDte(e.value)}
            locale="ru"
            showIcon
            placeholder="Дата рождения"
            readOnlyInput
            hideOnRangeSelection
          />
          <div className="flex flex-wrap h-full items-center gap-3">
            <div className="flex align-items-center">
              <RadioButton
                inputId="ingredient1"
                name="pizza"
                value="Cheese"
                onChange={() => handleInputForm(0, "male")}
                checked={userInfo.male === 0}
              />
              <label htmlFor="ingredient1" className="ml-2">
                Мужчина
              </label>
            </div>
            <div>
              <RadioButton
                inputId="ingredient2"
                name="pizza"
                value="Mushroom"
                onChange={() => handleInputForm(1, "male")}
                checked={userInfo.male === 1}
              />
              <label htmlFor="ingredient2" className="ml-2">
                Женщина
              </label>
            </div>
          </div>
        </div>
        {/* <p className="text-2xl font-semibold border-b-2 border-(--main-color) inline-block mt-10">
          Адрес
        </p>
        <div className="grid md:grid-cols-3 gap-5 mt-5">
          <InputText
            value={userInfo.address}
            id="username"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputForm(e.target.value, "address")
            }
          />
          <InputText
            value={userInfo.country}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputForm(e.target.value, "country")
            }
          />
          <InputText
            value={userInfo.city}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputForm(e.target.value, "city")
            }
          />
        </div>
        <p className="text-2xl font-semibold border-b-2 border-(--main-color) inline-block mt-10">
          Мои соц. сети
        </p>
        <div className="grid md:grid-cols-3 gap-5 mt-5">
          {socials.map((s) => {
            return (
              <div key={s.social_media_id} className="w-full">
                <p className="font-semibold mb-2">{s.social_media_name}</p>
                <InputText
                  className="w-full"
                  value={s.nickname}
                  id="username"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputForm(e.target.value, "address")
                  }
                />
              </div>
            );
          })}
        </div> */}
        <div className="grid grid-cols-3 gap-5 justify-end mt-5">
          <Button onClick={handleSaveChanges} className="col-start-3">
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
};
