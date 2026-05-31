'use client'
import { useAgentStore } from "@/store/agentStore";
import moment from "moment";
import { useEffect, useState } from "react";

export const Header = () => {
  const user = useAgentStore((state) => state.agentInfo)
  return <header className="h-20 bg-white shadow flex justify-between items-center px-7">
    <div></div>
    <div>
      <div className="flex gap-2 items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src={user?.avatar} alt="" className="w-full h-full" />
        </div>
        <span className="font-semibold cursor-pointer">Выйти</span>
      </div>
    </div>
  </header>
};
