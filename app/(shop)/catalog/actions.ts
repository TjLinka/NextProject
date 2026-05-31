"use server";

import { serverFetch } from "@/lib/auth";

export const getShopCatalog = async () => {
  const res = await serverFetch("/api/partner/Catalog/get-catalog");
  // const res = await serverFetch("/api/partner/Catalog/get-catalog-bytyp", {
  //   method: 'post',
  //   body: JSON.stringify({
  //     i_typ: 3,
  //     show_mine: false,
  //     offset: 0,
  //     show_count: 20,
  //   })
  // });
  const data = await res.json()
  return data;
};
export const getShopCategoryes = async () => {
  const res = await serverFetch("/api/partner/Catalog/get-catalog-sections");
  const data = await res.json()
  return data;
};
