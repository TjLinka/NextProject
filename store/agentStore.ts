import { create } from "zustand";
import { persist } from "zustand/middleware";
import { destroyCookie } from "nookies";
import { redirect } from "next/navigation";

type initialStateType = {
  avatar: string;
  access_token: string | null;
};

interface AgentState {
  id: string | number;
  access_token: string | null;
  setAgentInfo: (data: initialStateType) => void;
  logout: () => void;
  isAuth: boolean;
  agentInfo: initialStateType;
}

const initialState = {
  avatar: "",
  access_token: null,
};

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      id: "",
      access_token: null,
      agentInfo: initialState,
      isAuth: false,
      setAgentInfo: (data: initialStateType) =>
        set(() => ({
          agentInfo: data,
          isAuth: true,
          access_token: data.access_token,
        })),
      logout: () => {
        destroyCookie(null, "access_token");
        destroyCookie(null, "refreshToken");
        set({
          id: "",
          access_token: null,
          agentInfo: initialState,
          isAuth: false,
        });
        redirect("/login");
      },
    }),
    {
      name: "agent-storage",
    },
  ),
);
