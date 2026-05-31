"use client";
import { Button } from "@/components/UI/Button";
import { InputText } from "@/components/UI/InputText";
import { User } from "@/types/user/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const EditProfileClient = ({ data }: { data: User }) => {
  const [userInfo, setUserInfo] = useState<User>(data);

  const router = useRouter()

  const handleInputForm = useCallback((val: string, key: string) => {
    setUserInfo((prev) => ({
      ...prev,
      [key]: val,
    }));
  }, []);

  return (
    <div className="h-full">
      <Button onClick={() => {router.replace('/')}}>Вернуться</Button>
      <div className="bg-white p-4 rounded shadow w-full mt-5">
        <p className="text-2xl font-semibold">Редактирование данных</p>
        <div className="grid grid-cols-2 gap-5 mt-5">
          <InputText
            value={userInfo.email}
            placeholder="Почта"
            id="email"
            onInput={handleInputForm}
          />
          <InputText
            value={userInfo.fullname}
            placeholder="ФИО"
            id="fullname"
            onInput={handleInputForm}
          />
          <InputText
            value={userInfo.mobile_phone}
            placeholder="Телефон"
            id="mobile_phone"
            onInput={handleInputForm}
          />
        </div>
      </div>
    </div>
  );
};
