"use server";

import { serverFetch } from "@/lib/auth";

export const getPersonalAccountInfo = async () => {
  const res = await serverFetch("/api/partner/Account/get-operations/0", {
    method: 'POST',
    body: JSON.stringify({})
  });
  const data = await res.json()
  return data;
};
