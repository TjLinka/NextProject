/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/UI/Button";
import { User } from "@/types/user/types";
import { useRouter } from "next/navigation";
import { InputText } from "primereact/inputtext";
import { useCallback, useState } from "react";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { Nullable } from "primereact/ts-helpers";
import { RadioButton } from "primereact/radiobutton";

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
  const [userInfo, setUserInfo] = useState<User>(data);
  const [birth_date, setbirth_date] = useState<Nullable<Date>>(
    new Date(data.birth_date),
  );

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
        <div className="grid md:grid-cols-3 items-center gap-5 mt-5">
          <InputText
            value={userInfo.fullname}
            id="username"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputForm(e.target.value, "fullname")
            }
          />
          <InputText
            value={userInfo.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputForm(e.target.value, "email")
            }
          />
          <InputText
            value={userInfo.mobile_phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputForm(e.target.value, "mobile_phone")
            }
          />
          <Calendar
            value={birth_date}
            onChange={(e) => handleChangeBthDte(e.value)}
            locale="ru"
            showIcon
            placeholder="Дата рождения"
            readOnlyInput
            hideOnRangeSelection
          />
          <div className="flex flex-wrap gap-3">
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
        <p className="text-2xl font-semibold border-b-2 border-(--main-color) inline-block mt-10">
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
        </div>
      </div>
    </div>
  );
};
