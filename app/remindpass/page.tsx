"use client";

import { Button } from "@/components/UI/Button";
import { SectionTitle } from "@/components/UI/SectionTitle";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

export default function RemindPassPage() {
  const [phone, setPhone] = useState<string>("");
  const [agentNotFound, setAgentNotFound] = useState(false)

  const remindPassowrd = async () => {
    const res = await fetch(`/api/misc/remind-password?email=${phone.replace(/\D/g, '').replace(/^8/, '7')}`);
    const data = await res.json()
    if (data.StatusCode === 500) {
      setAgentNotFound(true)
    } else {
      setAgentNotFound(false)
    }
    
  };

  return (
    <>
      <div
        className={clsx(
          "flex flex-col justify-center items-center h-full opacity-100 transition-opacity duration-500 ease-in-out",
        )}
      >
        <div className="flex gap-4 text-4xl items-center animate__animated animate__fadeIn">
          <Image
            alt="Login Logo"
            src={`/imgs/AnterlLogo.png`}
            width={1000}
            height={1000}
            className="w-55"
          />
        </div>
        <div className="bg-white md:p-7 p-3 rounded-md shadow max-w-125 w-full mt-10 animate__animated animate__fadeIn">
          <SectionTitle>Восстановление пароля</SectionTitle>
          <p className="mt-2">
            Укажите Ваш номер телефона и вам придёт SMS с новым паролем от
            вашего личного кабинета
          </p>
          <div className="mt-5">
            <InputText
              className="w-full"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Номер телефона"
            />
            {agentNotFound && <span className="text-red-500">Пользователь не найден</span>}
          </div>
          <Button
            className="mt-5 w-full"
            disabled={!phone}
            onClick={remindPassowrd}
          >
            Восстановить
          </Button>
          <hr className="my-5 border-0 h-0.5 bg-(--main-color)" />
          {/* <p className="my-5 text-lg font-semibold text-center">ИЛИ</p> */}
          <Link href={"/login"}>
            <Button className="w-full">Авторизироваться</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
