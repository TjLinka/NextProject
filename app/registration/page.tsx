"use client";
import { Button } from "@/components/UI/Button";
import clsx from "clsx";
import Image from "next/image";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";

import { Password } from "primereact/password";
import { SectionTitle } from "@/components/UI/SectionTitle";
import Link from "next/link";
import { getSponsorForRegistration } from "@/dbQuery/dbQuerys";
import { InputMask } from "primereact/inputmask";

export default function RegistrationPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [email, setEmail] = useState("");
  const [sponsor_id, setSponsorId] = useState("");
  const [sponsor_name, setSponsorName] = useState("");
  const [phone, setPhone] = useState("");

  const isDisabled = !name || !email || !password || password !== passwordAgain;

  const [step, setStep] = useState<number>(0);
  const [inAction, setInAction] = useState(false);

  useEffect(() => {
    async function foo() {
      const { sponsor_id, sponsor_name } =
        await getSponsorForRegistration("00000069");
      setSponsorId(sponsor_id);
      setSponsorName(sponsor_name);
    }
    foo();
  }, []);

  return (
    <div
      className={clsx(
        "flex flex-col justify-center items-center h-full opacity-100 transition-opacity duration-500 ease-in-out",
      )}
    >
      <div className="flex gap-4 text-4xl items-center animate__animated animate__fadeIn">
        <Image
          alt="Login Logo"
          src={`/imgs/logo_hippo_menu.svg`}
          width={500}
          height={500}
          className="md:w-30 w-25"
        />
        <div>
          <span className="font-semibold ">GLEB.</span>
          <span className="">TEAM</span>
        </div>
      </div>
      <div className="bg-white md:p-7 p-3 rounded-md shadow max-w-125 w-full mt-10 animate__animated animate__fadeIn">
        {step === 0 && (
          <div>
            <SectionTitle>Регистрация</SectionTitle>
            <div className="mt-5">
              <p className="font-semibold md:text-lg text-sm">ФИО</p>
              <InputText
                autoComplete="new-password"
                value={name}
                className="w-full"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="md:mt-4 mt-2">
              <p className="font-semibold md:text-lg text-sm">E-mail</p>
              <input type="email" style={{ display: "none" }} />
              <InputText
                value={email}
                className="w-full"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="md:mt-4 mt-2">
              <p className="font-semibold md:text-lg text-sm">Телефон</p>
              <input type="phone" style={{ display: "none" }} />
              <InputMask
                className="w-full"
                value={phone}
                autoComplete="new-password"
                onChange={(e) => setPhone(e.target.value)}
                mask="9 (999) 999-99-99"
                placeholder="7 (999) 999-99-99"
              />
            </div>
            <div className="md:mt-4 mt-2">
              <p className="font-semibold md:text-lg text-sm">Пароль</p>
              <Password
                value={password}
                feedback={false}
                className="w-full"
                onChange={(e) => setPassword(e.target.value)}
                inputClassName="w-full"
              />
            </div>
            <div className="md:mt-4 mt-2">
              <p className="font-semibold md:text-lg text-sm">Пароль ещё раз</p>
              <Password
                value={passwordAgain}
                feedback={false}
                className="w-full"
                onChange={(e) => setPasswordAgain(e.target.value)}
                inputClassName="w-full"
              />
            </div>
            <Button
              disabled={isDisabled}
              className="text-center w-full text-white rounded-sm mt-4"
              loading={inAction}
              onClick={() => setStep(1)}
            >
              Далее
            </Button>
          </div>
        )}
        {step === 1 && (
          <div>
            <SectionTitle>Завершение регистрации</SectionTitle>
            <br />
            <p className="mt-2 md:text-[16px] text-sm">
              Проверьте ваши данные ниже. <br /> Если всё правильно то нажмите
              зарегестрировать <br /> или &nbsp;
              <span
                onClick={() => setStep(0)}
                className="text-(--main-text) md:text-[16px] text-sm mt-5 cursor-pointer underline"
              >
                отредактируйте
              </span>
              &nbsp;свои данные.
            </p>
            <p className="md:text-lg  text-sm md:mt-5 mt-2">
              <span className=" font-semibold">ФИО:</span>
              <span className="ml-2">{name}</span>
            </p>
            <p className="mt-2 md:text-lg text-sm ">
              <span className="font-semibold">E-mail:</span>
              <span className="ml-2">{email}</span>
            </p>
            <p className="mt-2 md:text-lg text-sm ">
              <span className="font-semibold">Телефон:</span>
              <span className="ml-2">{phone}</span>
            </p>
            <p className="mt-2 md:text-lg text-sm ">
              <span className="font-semibold">Пригласитель:</span>
              <span className="ml-2">
                {sponsor_id} - {sponsor_name}
              </span>
            </p>
            <Button
              className="text-center w-full text-white rounded-sm md:mt-10 mt-5"
              loading={inAction}
            >
              Зарегестрировать
            </Button>
          </div>
        )}
        <hr className="my-5 border-0 h-0.5 bg-(--main-color)" />
        {/* <p className="my-5 text-lg font-semibold text-center">ИЛИ</p> */}
        <Link href={"/login"}>
          <Button className="w-full">Авторизироваться</Button>
        </Link>
      </div>
    </div>
  );
}
