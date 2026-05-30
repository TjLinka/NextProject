"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {

  const router = useRouter()

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSumbit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ login, password }),
      credentials: 'include'
    });
    router.push('/')
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-3 rounded-md shadow md:w-1/2 w-full">
        <p className="text-center text-xl">Next.js TjLink</p>
        <form onSubmit={handleSumbit}>
          <div>
            <p>Login</p>
            <input
              onInput={(e: React.InputEvent<HTMLInputElement>) =>
                setLogin(e.currentTarget.value)
              }
              type="text"
              className="border w-full border-gray-300 rounded-sm h-10 outline-none pl-2 mt-4"
            />
          </div>
          <div>
            <p>Password</p>
            <input
              onInput={(e: React.InputEvent<HTMLInputElement>) =>
                setPassword(e.currentTarget.value)
              }
              type="password"
              className="border w-full border-gray-300 rounded-sm h-10 outline-none pl-2 mt-4"
            />
          </div>
          <button className="text-center w-full bg-green-600 text-white rounded-sm h-10 mt-4">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
