"use server";
import { serverFetch } from "@/lib/auth";
import { Nullable } from "primereact/ts-helpers";

export const getOrders = async (dates? : Nullable<(Date | null)>[]) => {
  const res = await serverFetch("/api/partner/Webshop/get-list", {
    method: "POST",
    body: JSON.stringify({
      from: dates ? dates[0] : null,
      to: dates ? dates[1] : null,
    }),
  });
  const data = await res.json();

  return data;
};
