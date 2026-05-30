"use server";

import { serverFetch } from "@/lib/auth";

export const getShopCatalog = async () => {
  const res = await serverFetch("/api/partner/Catalog/get-catalog");
  const data = await res.json()
  return data;
};
export const getShopCategoryes = async () => {
  const res = await serverFetch("/api/partner/Catalog/get-catalog-sections");
  const data = await res.json()
  return data;
};
