"use client";
import { Button } from "@/components/UI/Button";
import { useAgentStore } from "@/store/agentStore";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const setUserInfo = useAgentStore((state) => state.setAgentInfo);
  const logout = useAgentStore((state) => state.logout);
  const isAuth = useAgentStore((state) => state.access_token);
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [inAction, setInAction] = useState(false);
  const [isLoginSuccess, setisLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleSumbit = async () => {
    setInAction(true);
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ login: login.replace(/\D/g, '').replace(/^8/, '7'), password }),
      credentials: "include",
    });
    const data = await res.json();
    if (data.StatusCode !== 401) {
      setisLoginSuccess(true);
      setTimeout(() => {
        setUserInfo(data);
        window.location.href = "/";
      }, 500);
    } else {
      setInAction(false);
      setLoginError('Введён не верный логин или пароль!');
    }
  };

  useEffect(() => {
    logout();
  }, []);
  return (
    <div
      className={clsx(
        "flex flex-col justify-center items-center h-full opacity-100 transition-opacity duration-500 ease-in-out",
        {
          "opacity-0!": isLoginSuccess,
        },
      )}
    >
      <div className="flex gap-4 text-4xl items-center animate__animated animate__fadeIn">
        <Image
          alt="Login Logo"
          src={`/imgs/AnterlLogo.png`}
          width={1000}
          height={1000}
          className="w-60"
        />
        {/* <div>
          <span className="font-semibold ">GLEB.</span>
          <span className="">TEAM</span>
        </div> */}
      </div>
      <div className="bg-white p-7 rounded-md shadow max-w-125 w-full mt-10 animate__animated animate__fadeIn">
        <div>
          <p className="font-semibold text-lg">Логин</p>
          <input
            autoComplete="new-password"
            onInput={(e: React.InputEvent<HTMLInputElement>) =>
              setLogin(e.currentTarget.value)
            }
            type="text"
            className="border w-full border-gray-300 rounded-sm h-10 outline-none pl-2 mt-1"
          />
        </div>
        <div className="mt-4">
          <p className="font-semibold text-lg">Пароль</p>
          <input
            autoComplete="new-password"
            onInput={(e: React.InputEvent<HTMLInputElement>) =>
              setPassword(e.currentTarget.value)
            }
            type="password"
            className="border w-full border-gray-300 rounded-sm h-10 outline-none pl-2 mt-1"
          />
        </div>
        <Button
          className="text-center w-full text-white rounded-sm mt-4"
          loading={inAction}
          onClick={handleSumbit}
        >
          Войти
        </Button>
        {loginError && (
          <span className="text-sm text-red-500">{loginError}</span>
        )}
        <p className="font-semibold flex md:flex-row flex-col items-center  gap-2 mt-5">
          Вы ещё не с нами?{" "}
          <Link href={"/registration"} className="underline">
            Станьте частью нашей команды!
          </Link>
        </p>
        <p className="font-semibold flex md:flex-row flex-col items-center gap-2 mt-2">
          Забыли пароль?{" "}
          <Link href={"/remindpass"} className="underline">
            Восстановить
          </Link>
        </p>
      </div>
    </div>
  );
}
