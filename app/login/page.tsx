"use client";
import { Button } from "@/components/UI/Button";
import { useAgentStore } from "@/store/agentStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const setUserInfo = useAgentStore((state) => state.setAgentInfo);
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [inAction, setInAction] = useState(false)

  const handleSumbit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInAction(true)
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ login, password }),
      credentials: "include",
    });
    const data = await res.json();
    setUserInfo(data);
    router.push("/");
  };

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="flex gap-4 text-4xl items-center animate__animated animate__fadeIn">
        <Image
          alt="Login Logo"
          src={`/imgs/logo_hippo_menu.svg`}
          width={500}
          height={500}
          className="w-30"
        />
        <div>
          <span className="font-semibold ">GLEB.</span>
          <span className="">TEAM</span>
        </div>
      </div>
      <div className="bg-white p-7 rounded-md shadow max-w-125 w-full mt-10 animate__animated animate__fadeIn">
        <form onSubmit={handleSumbit}>
          <div>
            <p className="font-semibold text-lg">Login</p>
            <input
              onInput={(e: React.InputEvent<HTMLInputElement>) =>
                setLogin(e.currentTarget.value)
              }
              type="text"
              className="border w-full border-gray-300 rounded-sm h-10 outline-none pl-2 mt-1"
            />
          </div>
          <div className="mt-4">
            <p className="font-semibold text-lg">Password</p>
            <input
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
          >
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}
